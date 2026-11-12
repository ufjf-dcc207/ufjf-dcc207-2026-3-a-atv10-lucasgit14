# Magic Sort

Um jogo de organização de cores feito com React e TypeScript. O objetivo é
deixar cada tubo cheio com bolas de uma única cor.

## Como jogar

- Clique em um tubo com bolas e depois em um tubo vazio ou com a mesma cor no topo.
- Cada jogada move uma bola e conta como um movimento.
- Use **Desfazer** para voltar uma jogada, **Reiniciar** para restaurar o tabuleiro
  atual ou **Novo jogo** para embaralhar as bolas.
- A partida termina quando cada tubo preenchido contém quatro bolas da mesma cor.

## Desenvolvimento

Na pasta deste projeto:

```sh
npm install
npm run dev
```

Para validar o projeto, execute `npm run build` e `npm run lint`.

## Estrutura do jogo

- `src/game.ts` define o tabuleiro, as regras e o reducer da partida.
- `src/GameContext.ts` e `src/GameProvider.tsx` compartilham estado e ações via Context.
- `src/App.tsx` renderiza o tabuleiro e os controles; os estilos responsivos ficam em
  `src/App.css` e `src/index.css`.
