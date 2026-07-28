# 🌐 Portfólio — Sergio L. Pereira

> Desenvolvedor Front-end · Criador de interfaces web de alta performance, focado em tecnologias modernas e na satisfação do usuário.

🔗 **Deploy:** [portfolio-ashy-six-24.vercel.app](https://portfolio-ashy-six-24.vercel.app)

---

## ✨ Funcionalidades

- Animação de digitação (typewriter) no nome da hero section
- Logo com efeito hover suave e cursor interativo (`cursor: pointer`)
- Botões com bordas arredondadas para uma UI mais amigável
- Layout responsivo e moderno
- Seções: Sobre · Habilidades · Projetos · Contato

---

## 🛠️ Tecnologias

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Vercel** (deploy)

---

## 🐛 Correções Aplicadas

| Problema | Causa | Solução |
|---|---|---|
| Logo sumia no hover | `overflow: hidden` cortando o efeito | Ajuste no container e `z-index` |
| Cursor não mudava sobre a logo | Falta de `cursor: pointer` | Adicionado via Tailwind/CSS |
| Nome aparecia de uma vez | Sem animação de entrada | Efeito typewriter com CSS/JS |
| Botões com bordas retas | `border-radius` padrão | Aplicado `rounded-full` ou `rounded-xl` |

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/luucassp/portfolio.git
cd portfolio

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
portfolio/
├── app/
│   ├── page.tsx          # Página principal
│   ├── globals.css       # Estilos globais
│   └── components/
│       ├── Logo.tsx      # Componente da logo
│       ├── Hero.tsx      # Seção inicial com typewriter
│       └── ...
├── public/               # Assets estáticos
└── README.md
```

---

## 📬 Contato

Feito com 💙 por **Sergio L. Pereira**

[![GitHub](https://img.shields.io/badge/GitHub-luucassp-181717?style=flat&logo=github)](https://github.com/luucassp)This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
