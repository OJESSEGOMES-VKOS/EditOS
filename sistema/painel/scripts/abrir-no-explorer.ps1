# Abre o Explorer com um arquivo selecionado (ou numa pasta) e traz a janela pra frente.
# Chamado pelo painel (src/pages/api/abrir.ts). O Windows não deixa um programa em segundo plano (o painel) jogar uma
# janela na frente de quem está usando o PC, então ela nascia minimizada atrás do navegador. O toque de Alt antes de
# focar é o jeito conhecido de liberar isso.
param([Parameter(Mandatory = $true)][string]$Alvo, [switch]$Selecionar)

$pasta = if ($Selecionar) { Split-Path -Parent $Alvo } else { $Alvo }
if ($Selecionar) { Start-Process explorer.exe -ArgumentList "/select,`"$Alvo`"" } else { Start-Process explorer.exe -ArgumentList "`"$Alvo`"" }

Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class Janela {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern void keybd_event(byte k, byte s, uint f, UIntPtr e);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, IntPtr p);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool ligar);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
  [DllImport("user32.dll")] public static extern void SwitchToThisWindow(IntPtr h, bool alt);
  // pega carona na janela que está na frente (o navegador) pra poder passar a frente pra janela nova
  public static void Frente(IntPtr h) {
    IntPtr atual = GetForegroundWindow();
    uint dela = GetWindowThreadProcessId(atual, IntPtr.Zero), minha = GetCurrentThreadId();
    keybd_event(0x12, 0, 0, UIntPtr.Zero); keybd_event(0x12, 0, 2, UIntPtr.Zero);
    AttachThreadInput(minha, dela, true);
    ShowWindow(h, 9); BringWindowToTop(h); SetForegroundWindow(h);
    AttachThreadInput(minha, dela, false);
    if (GetForegroundWindow() != h) SwitchToThisWindow(h, true);
  }
}
'@

# espera a janela daquela pasta aparecer (até 5 s) e traz pra frente
# compara pelo caminho da pasta (o endereço da janela quebra com "#" no nome, como em "#01")
$alvoPasta = $pasta.TrimEnd('\').ToLowerInvariant()
$shell = New-Object -ComObject Shell.Application
for ($i = 0; $i -lt 25; $i++) {
  Start-Sleep -Milliseconds 200
  $j = $shell.Windows() | Where-Object { try { $_.Document.Folder.Self.Path.TrimEnd('\').ToLowerInvariant() -eq $alvoPasta } catch { $false } } | Select-Object -First 1
  if ($j) {
    [Janela]::Frente([IntPtr]$j.HWND)
    exit 0
  }
}
exit 0
