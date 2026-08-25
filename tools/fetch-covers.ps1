$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $root "public\covers"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$books = @(
  @{ Id = "parola-magica"; Q = "isbn:9788804710387" },
  @{ Id = "hce-1"; Q = "isbn:9788858025918" },
  @{ Id = "hce-vendita"; Q = "isbn:9788858029558" },
  @{ Id = "basta-dirlo"; Q = "isbn:9788804817352" },
  @{ Id = "instant-persuasion"; Q = "isbn:9788858051498" },
  @{ Id = "usa-cervello"; Q = "isbn:9788804786306" },
  @{ Id = "bada"; Q = "isbn:9788804812074" },
  @{ Id = "instant-emotions"; Q = "isbn:9788858054581" },
  @{ Id = "incantali"; Q = "isbn:9788804816782" },
  @{ Id = "super-senso"; Q = "Il Super Senso Paolo Borzacchiello" },
  @{ Id = "quinta"; Q = "La quinta essenza Paolo Borzacchiello Mondadori" },
  @{ Id = "codice"; Q = "Il codice segreto del linguaggio Borzacchiello" },
  @{ Id = "chimica"; Q = "La chimica segreta delle interazioni umane Borzacchiello" },
  @{ Id = "forse-felice"; Q = "Forse sei già felice Borzacchiello" },
  @{ Id = "chiedi"; Q = "Chiedi bene e ti sarà dato Borzacchiello" },
  @{ Id = "colleziona"; Q = "Colleziona attimi di altissimo splendore Borzacchiello" },
  @{ Id = "da-adesso"; Q = "Da adesso in poi Borzacchiello Mondadori" },
  @{ Id = "nessuno"; Q = "Nessuno può farti star male Sednaoui Borzacchiello" },
  @{ Id = "brillare"; Q = "Brillare come una stella Borzacchiello" },
  @{ Id = "stai-calmo"; Q = "Stai calmo e usa le parole giuste Borzacchiello" }
)

function Find-CoverUrl([string]$q) {
  $url = "https://www.googleapis.com/books/v1/volumes?q=$([uri]::EscapeDataString($q))&maxResults=5"
  $res = Invoke-RestMethod -Uri $url -TimeoutSec 25 -Headers @{ "User-Agent" = "Paroloteca/1.0" }
  foreach ($item in @($res.items)) {
    $links = $item.volumeInfo.imageLinks
    if (-not $links) { continue }
    $thumb = $links.thumbnail
    if (-not $thumb) { $thumb = $links.smallThumbnail }
    if ($thumb) {
      $thumb = $thumb -replace "^http://", "https://"
      $thumb = $thumb -replace "zoom=1", "zoom=2"
      $thumb = $thumb -replace "&edge=curl", ""
      return $thumb
    }
  }
  return $null
}

foreach ($book in $books) {
  $dest = Join-Path $outDir "$($book.Id).jpg"
  if (Test-Path $dest) {
    Write-Host "skip $($book.Id)"
    continue
  }
  try {
    $cover = Find-CoverUrl $book.Q
  } catch {
    Write-Host "api  $($book.Id)"
    continue
  }
  if (-not $cover) {
    Write-Host "none $($book.Id)"
    continue
  }
  try {
    Invoke-WebRequest -Uri $cover -OutFile $dest -TimeoutSec 25 -Headers @{ "User-Agent" = "Paroloteca/1.0" }
    Write-Host "ok   $($book.Id)"
  } catch {
    Write-Host "fail $($book.Id)"
  }
  Start-Sleep -Milliseconds 500
}
