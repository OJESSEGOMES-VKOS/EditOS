"""O que as ferramentas de conferência precisam do ffmpeg, sem depender de filtro que o ffmpeg do Remotion não tem.

O ffmpeg que vem com o Remotion (node_modules/@remotion/compositor-*) só decodifica, escala e grava; não tem
ebur128, tile nem drawtext. Por isso a medida de volume (ITU-R BS.1770) e o pico real (sobreamostragem 4x) são
feitos aqui em numpy, e a folha de quadros é montada com Pillow.
"""
import json, shutil, subprocess, sys
from pathlib import Path

import numpy as np
from scipy.signal import lfilter, resample_poly

RAIZ = Path(__file__).resolve().parent.parent
SR = 48000


def exe(nome: str) -> str:
    """ffmpeg/ffprobe do sistema; se não houver, o do Remotion desta pasta."""
    achado = shutil.which(nome)
    if achado:
        return achado
    for d in sorted((RAIZ / 'node_modules' / '@remotion').glob('compositor-*')):
        f = d / (nome + ('.exe' if sys.platform == 'win32' else ''))
        if f.is_file():
            return str(f)
    raise SystemExit(f'não achei o {nome}: rode a instalação do estúdio (npm install) ou instale o ffmpeg')


def sonda(v: Path) -> dict:
    r = subprocess.run([exe('ffprobe'), '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(v)],
                       capture_output=True, text=True)
    return json.loads(r.stdout or '{}')


def audio(v: Path) -> np.ndarray:
    """o áudio do arquivo em float32 estéreo 48 kHz (vazio se não houver som)"""
    r = subprocess.run([exe('ffmpeg'), '-v', 'error', '-i', str(v), '-map', '0:a:0', '-ar', str(SR), '-ac', '2',
                        '-c:a', 'pcm_s16le', '-f', 'wav', '-'], capture_output=True)
    if not r.stdout:
        return np.zeros((0, 2), dtype=np.float32)
    # o WAV por pipe sai sem o tamanho no cabeçalho: lê os dados direto depois do bloco 'data'
    i = r.stdout.find(b'data')
    dados = r.stdout[i + 8:] if i != -1 else b''
    dados = dados[:len(dados) // 4 * 4]
    return np.frombuffer(dados, dtype=np.int16).astype(np.float32).reshape(-1, 2) / 32768


def lufs(x: np.ndarray) -> float | None:
    """volume integrado, ITU-R BS.1770 (filtro K + gate absoluto -70 e relativo -10)"""
    if len(x) < int(0.4 * SR):
        return None
    b1, a1 = [1.53512485958697, -2.69169618940638, 1.19839281085285], [1.0, -1.69065929318241, 0.73248077421585]
    b2, a2 = [1.0, -2.0, 1.0], [1.0, -1.99004745483398, 0.99007225036621]
    k = lfilter(b2, a2, lfilter(b1, a1, x, axis=0), axis=0)
    bloco, passo = int(0.4 * SR), int(0.1 * SR)
    ms = np.array([np.sum(np.mean(k[i:i + bloco] ** 2, axis=0)) for i in range(0, len(k) - bloco + 1, passo)])
    ms = ms[-0.691 + 10 * np.log10(ms + 1e-12) > -70]
    if not len(ms):
        return None
    rel = -0.691 + 10 * np.log10(np.mean(ms)) - 10
    ms = ms[-0.691 + 10 * np.log10(ms) > rel]
    return float(-0.691 + 10 * np.log10(np.mean(ms)))


def pico_real(x: np.ndarray) -> float | None:
    """pico real (true peak) em dBTP, por sobreamostragem 4x"""
    if not len(x):
        return None
    p = float(np.max(np.abs(resample_poly(x, 4, 1, axis=0))))
    return 20 * np.log10(p) if p > 0 else None


def quadro(v: Path, t: float, largura: int):
    """um quadro do vídeo no tempo t, como imagem Pillow"""
    from PIL import Image
    r = subprocess.run([exe('ffmpeg'), '-v', 'error', '-ss', f'{t:.3f}', '-i', str(v), '-frames:v', '1',
                        '-vf', f'scale={largura}:-2', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True)
    if not r.stdout:
        return None
    import io
    return Image.open(io.BytesIO(r.stdout)).convert('RGB')
