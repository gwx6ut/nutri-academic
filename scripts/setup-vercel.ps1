param(
    [string]$VercelToken
)

Write-Host "This script helps link the project to Vercel and add env vars."
Write-Host "If you don't pass a token, you'll be prompted for interactive login."

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing globally..."
    npm i -g vercel
}

if (-not $VercelToken) {
    Write-Host "No token provided. Running interactive login..."
    vercel login
    Write-Host "Now run `vercel link` to connect this local repo to your Vercel project."
    exit 0
}

# Non-interactive flow using token
Write-Host "Using provided token to deploy and link (non-interactive)."

# First deploy once to create/link the project
$npx = "npx vercel --prod --token $VercelToken --confirm"
Write-Host "Running: $npx"
Invoke-Expression $npx

Write-Host "If you want to add environment variables from .env.example, run the commands below replacing values as needed:"
Write-Host "Example (PowerShell):"
Write-Host "npx vercel env add NEXT_PUBLIC_SUPABASE_URL 'your-value' production --token $VercelToken"
Write-Host "npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY 'your-value' production --token $VercelToken"
Write-Host "npx vercel env add SUPABASE_SERVICE_ROLE_KEY 'your-secret-value' production --token $VercelToken"

Write-Host "Done. Check https://vercel.com/dashboard to confirm the project and environment variables."
