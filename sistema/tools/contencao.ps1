# Contenção: o trabalho pesado do estúdio nunca trava o computador do dono (G36).
# Enquanto roda, a cada ciclo pega os processos pesados do estúdio (ffmpeg, ffprobe, blender, o navegador e o
# compositor do Remotion, o Python do estúdio) e:
#   PROCESSADOR: prioridade "Ociosa" e só os primeiros núcleos, deixando os últimos $Livres sempre livres pro dono.
#   PLACA DE VÍDEO: prioridade ociosa também na placa (o agendador do Windows atende primeiro a tela do dono) e, pro
#   Blender, um limitador de uso: enquanto o dono está mexendo no computador (teclado ou mouse nos últimos
#   $Ausente s), o Blender trabalha só $Uso% do tempo (roda um pedaço, pausa um pedaço) e a placa sobra pra tela;
#   quando o dono sai, o Blender sobe pra $Maximo% (nunca 100%: a placa a 100% deu problema no PC do dono).
# uso: powershell -NoProfile -ExecutionPolicy Bypass -File tools/contencao.ps1 [-Enquanto <pid>] [-Livres 6] [-Uso 40] [-Ausente 60]
#   -Enquanto <pid>: para sozinho quando esse processo acabar (o com-trava.sh passa o próprio pid)
#   sem -Enquanto: para quando não houver mais nenhum processo pesado por 1 minuto
#   -Uso 0 pausa o Blender inteiro enquanto o dono estiver usando o PC; -Maximo é o teto com o dono fora (padrão 90)
param([int]$Enquanto = 0, [int]$Livres = 6, [int]$Uso = 40, [int]$Maximo = 90, [int]$Ausente = 60)

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class Contencao {
    [DllImport("gdi32.dll")] public static extern int D3DKMTSetProcessSchedulingPriorityClass(IntPtr hProcess, int priority);
    [DllImport("ntdll.dll")] public static extern int NtSuspendProcess(IntPtr hProcess);
    [DllImport("ntdll.dll")] public static extern int NtResumeProcess(IntPtr hProcess);
    [StructLayout(LayoutKind.Sequential)] struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }
    [DllImport("user32.dll")] static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);
    public static double SegundosSemUso() {
        LASTINPUTINFO l = new LASTINPUTINFO(); l.cbSize = (uint)Marshal.SizeOf(l);
        if (!GetLastInputInfo(ref l)) return 0;
        return ((uint)Environment.TickCount - l.dwTime) / 1000.0;
    }
}
'@

$nucleos = [Environment]::ProcessorCount
$usar = [Math]::Max(2, $nucleos - $Livres)
$mascara = [Int64]0
for ($i = 0; $i -lt $usar; $i++) { $mascara = $mascara -bor ([Int64]1 -shl $i) }
$nomes = 'ffmpeg', 'ffprobe', 'blender', 'chrome-headless-shell', 'remotion', 'compositor', 'whisper'
$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$ciclo = 2.0                      # segundos de cada ciclo
$pausados = @{}                    # pid -> processo pausado por nós (sempre retomado antes de sair)
$ocioso = 0

function Retomar-Todos {
    # retoma TODO Blender, não só os que este vigia pausou: se um vigia anterior foi encerrado no meio de uma pausa,
    # o Blender ficaria parado pra sempre. Retomar um processo que não está pausado não faz nada.
    foreach ($b in Get-Process -Name 'blender*' -ErrorAction SilentlyContinue) {
        try { [void][Contencao]::NtResumeProcess($b.Handle) } catch {}
    }
    $pausados.Clear()
}
Retomar-Todos

try {
    while ($true) {
        $achou = $false
        $blenders = @()
        foreach ($p in Get-Process -ErrorAction SilentlyContinue) {
            $pesado = $false
            foreach ($n in $nomes) { if ($p.ProcessName -like "*$n*") { $pesado = $true } }
            # Python só o do estúdio, nunca outro Python do sistema
            if (-not $pesado -and $p.ProcessName -like 'python*') {
                try { if ($p.Path -and $p.Path.StartsWith($raiz)) { $pesado = $true } } catch {}
            }
            if (-not $pesado) { continue }
            $achou = $true
            try {
                if ($p.PriorityClass -ne 'Idle') { $p.PriorityClass = 'Idle' }
                if ([Int64]$p.ProcessorAffinity -ne $mascara) { $p.ProcessorAffinity = [IntPtr]$mascara }
                [void][Contencao]::D3DKMTSetProcessSchedulingPriorityClass($p.Handle, 0)  # 0 = ociosa na placa
            } catch {}
            if ($p.ProcessName -like '*blender*') { $blenders += $p }
        }

        # limitador da placa: só com o dono usando o computador e só no Blender (quem mais usa a placa)
        $donoUsando = [Contencao]::SegundosSemUso() -lt $Ausente
        $teto = if ($donoUsando) { [Math]::Min($Uso, $Maximo) } else { $Maximo }
        if ($blenders.Count -gt 0 -and $teto -lt 100) {
            $roda = $ciclo * $teto / 100.0
            if ($roda -gt 0) { Retomar-Todos; Start-Sleep -Milliseconds ([int]($roda * 1000)) }
            foreach ($b in $blenders) {
                try { [void][Contencao]::NtSuspendProcess($b.Handle); $pausados[$b.Id] = $b } catch {}
            }
            Start-Sleep -Milliseconds ([int](($ciclo - $roda) * 1000))
        } else {
            Retomar-Todos
            Start-Sleep -Seconds $ciclo
        }

        if ($Enquanto -gt 0) {
            if (-not (Get-Process -Id $Enquanto -ErrorAction SilentlyContinue)) { break }
        } else {
            if ($achou) { $ocioso = 0 } else { $ocioso += $ciclo }
            if ($ocioso -ge 60) { break }
        }
    }
} finally {
    Retomar-Todos   # nunca deixa nada pausado pra trás
}
