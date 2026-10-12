# Lance le backend OSEOR (Spring Boot) en local.
# 1. Lit les variables de .env (DB_PASSWORD, JWT_SECRET, MAIL_*…)
# 2. Génère JWT_SECRET la première fois et l'enregistre dans .env
# 3. Crée la base oseor_db si elle n'existe pas
# 4. Démarre l'API sur http://localhost:8080

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

# mvnw.cmd échoue si JAVA_HOME contient des guillemets ("C:\Program Files\Java\jdk-17")
if ($env:JAVA_HOME) { $env:JAVA_HOME = $env:JAVA_HOME.Trim('"') }
$envFile = Join-Path $PSScriptRoot '.env'

if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $PSScriptRoot '.env.example') $envFile
    Write-Host "Fichier .env créé : renseignez DB_PASSWORD (mot de passe PostgreSQL) puis relancez." -ForegroundColor Yellow
    exit 1
}

Get-Content $envFile -Encoding UTF8 | ForEach-Object {
    if ($_ -match '^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$') {
        [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2].Trim('"'), 'Process')
    }
}

if (-not $env:JWT_SECRET) {
    $bytes = New-Object byte[] 48
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $env:JWT_SECRET = [Convert]::ToBase64String($bytes)
    Add-Content $envFile "`nJWT_SECRET=$($env:JWT_SECRET)" -Encoding UTF8
    Write-Host "JWT_SECRET généré et enregistré dans .env" -ForegroundColor Green
}

# Création de la base si besoin (psql de l'installation PostgreSQL locale)
$psql = Get-ChildItem 'C:\Program Files\PostgreSQL\*\bin\psql.exe' -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
if ($psql) {
    $env:PGPASSWORD = $env:DB_PASSWORD
    $user = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { 'postgres' }
    $exists = & $psql.FullName -U $user -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='oseor_db'" postgres
    if ($LASTEXITCODE -ne 0) { Write-Host "Connexion PostgreSQL impossible : vérifiez DB_PASSWORD dans .env" -ForegroundColor Red; exit 1 }
    if ($exists -ne '1') {
        & $psql.FullName -U $user -h localhost -c "CREATE DATABASE oseor_db" postgres | Out-Null
        Write-Host "Base oseor_db créée" -ForegroundColor Green
    }
    Remove-Item Env:PGPASSWORD
}

& .\mvnw.cmd spring-boot:run
