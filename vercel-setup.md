# Deploy no Vercel — Guia rápido

Este guia mostra como conectar seu repositório ao Vercel e configurar variáveis de ambiente para manter o site sempre disponível.

Pré-requisitos
- Conta no GitHub (ou GitLab/Bitbucket) com o repositório do projeto.
- Conta no Vercel (https://vercel.com).

1) Push do repositório para GitHub

Abra um terminal no diretório do projeto e execute:

```bash
git init
git add .
git commit -m "Initial commit"
# Crie o repositório no GitHub (manual ou usando gh CLI)
# Exemplo com gh CLI:
# gh repo create my-org/my-repo --public --source=. --remote=origin
# Em seguida:
git push -u origin main
```

2) Importar projeto no Vercel
- Acesse https://vercel.com/dashboard
- Clique em **New Project** → **Import Git Repository** → selecione o repositório
- O Vercel deve detectar Next.js automaticamente (framework: Next.js). Se não, selecione Next.js.
- Build Command: `npm run build` (default)
- Output Directory: deixe em branco (Next.js padrão)
- Instalação: `npm ci` ou `npm install`

3) Adicionar variáveis de ambiente (no Vercel)
- Vá em **Project Settings** → **Environment Variables**
- Adicione as variáveis listadas em `.env.example`:
  - `NEXT_PUBLIC_SUPABASE_URL` → valor do Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → valor do Supabase
  - `SUPABASE_SERVICE_ROLE_KEY` → (Environment: Production, Value hidden)
- Salve as variáveis para `Production` (e `Preview` se desejar).

4) Configurações recomendadas
- Habilite **Auto Deploy** para deployments via push/PR.
- Configure proteção de branches (ex.: `main`) no GitHub se necessário.
- Se usar domínio próprio, configure DNS no Vercel → Domains.

5) Monitoramento / Uptime
- Configure um monitor (UptimeRobot, Better Uptime) apontando para a URL do site.
- Para alertas, conecte Slack/Email/PagerDuty.

6) Manter site sempre ativo
- Vercel é serverless — projetos Next.js servidos por Vercel ficam prontos em escala. Para reduzir cold starts:
  - Use planos pagos do Vercel com recursos in-app para maior SLA.
  - Evite longos jobs síncronos na rota pública.

Problemas comuns
- Build falha por falta de variáveis: verifique `Environment Variables` no Vercel.
- Erros de autenticação Supabase: confirme as chaves e que `NEXT_PUBLIC_*` estão corretas.

Se quiser, eu posso:
- adicionar um arquivo `vercel.json` (opcional)
- gerar instruções para CI alternativa (GitHub Actions)
- conectar o repositório se você me autorizar a acessar sua conta Vercel/GitHub (requer credenciais)
