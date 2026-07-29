@AGENTS.md

# Portfólio pessoal — Next.js, TypeScript, Tailwind, deploy na Vercel.

## Hero animado (dragão)

Peça principal da home: um dragão de perfil cuspindo fogo para cima, animado
quadro a quadro. Contexto completo e histórico das decisões em
`docs/briefing-hero-dragao.md` — leia antes de mexer no hero.

### Restrições — não violar sem me perguntar antes

- **Nenhuma biblioteca de animação.** Nada de framer-motion, gsap, lenis,
  react-spring ou similar. A animação é canvas + rAF, ou SVG puro. O custo em
  KB no hero não se justifica.
- **Orçamento de peso**: a sequência de quadros baixada na primeira visita não
  passa de 2 MB no desktop e 800 KB no mobile.
- **O LCP nunca pode ser a sequência de quadros.** Tem que ser o texto ou o
  poster. Se um ajuste mudar isso, o ajuste está errado.
- **`prefers-reduced-motion` é obrigatório**, não opcional: sem movimento,
  mostra o quadro de pico estático.
- **Texto sempre em HTML**, nunca dentro do SVG ou desenhado no canvas.
  Precisa ser indexável, selecionável e legível por leitor de tela.
- **A animação é decorativa**: `aria-hidden` no fundo. O hero tem que fazer
  sentido sem ela.
- **Sem `localStorage`/`sessionStorage`** no hero — não há nada que valha
  persistir ali.

### Escopo da regra "nenhuma biblioteca de animação"

Vale para os componentes do hero (`DragonBreath`, `ScrollFrameSequence`,
`DragonHero`) — SVG puro ou canvas + rAF, sem dependências.

O `app/page.tsx` ainda importa `framer-motion` para o menu mobile e o modal
de skills. Decisão em aberto, a ser tratada como tarefa separada — enquanto
existir, o bundle carrega na home junto com o hero.

### Como trabalhar nisso

- Página de trabalho é `/lab/hero`, isolada do layout do site. Só promova pra
  home quando eu pedir.
- Um passo por vez, com estado verificável ao final de cada um.
- Em auditorias (contraste, performance, acessibilidade): **relate primeiro,
  corrija depois que eu confirmar.**
- Não commite os arquivos de `public/frames/` sem eu pedir — são muitos e
  pesados. `assets-src/` e `public/frames/` já estão no `.gitignore`.

## Geral

- Componentes em `components/`, um arquivo por componente, export default.
- Client components só quando precisam de estado, efeito ou API do browser.
- Comentário de cabeçalho explicando o uso nos componentes não óbvios.
