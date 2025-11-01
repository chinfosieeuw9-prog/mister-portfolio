# sync-backup-to-cloud.ps1
$source = "C:\Users\Jordan\Desktop\mister-backups"
$dest = "C:\Users\Jordan\OneDrive\mister-backups"

# Zorg dat de bestemming een map is
if (Test-Path $dest) {
	$item = Get-Item $dest -ErrorAction SilentlyContinue
	if ($item -and -not $item.PSIsContainer) {
		# Bestaat als bestand, kopieer dan naar een nieuwe map naast dit bestand
		$parent = Split-Path $dest -Parent
		$leaf = Split-Path $dest -Leaf
		$dest = Join-Path $parent ($leaf + "-folder")
	}
}

if (-not (Test-Path $dest)) {
	New-Item -ItemType Directory -Path $dest | Out-Null
}

Copy-Item -Path ($source + "\*") -Destination $dest -Recurse -Force
