# CONTRIBUIÇÃO E DESENVOLVIMENTO

## Como contribuir
Este projeto é privado, mas caso você seja autorizado, siga as etapas:

1. Faça um fork do repositório (se aplicável).
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commits claros e objetivos.
4. Rode os testes antes de enviar:
   ```bash
   npm test
   ```
5. Abra um Pull Request detalhando as mudanças.

## Padrões de Código
- Use TypeScript e siga o padrão de componentes funcionais React.
- Utilize ESLint e siga as regras do projeto (`npm run lint`).
- Escreva testes para novas funcionalidades.
- Prefira funções puras e componentes desacoplados.
- Use nomes claros para variáveis, funções e componentes.

## Estrutura de Branches
- `main`: produção
- `dev`: desenvolvimento
- `feature/*`: novas funcionalidades
- `fix/*`: correções

## Testes
- Utilize Jest e Testing Library.
- Testes ficam próximos aos arquivos testados, com sufixo `.test.ts(x)`.

## Ambiente
- Node.js 20+
- npm 9+
- Next.js 16+
- React 19+

## Contato
Dúvidas técnicas: @seventattoo_ofc (Instagram)
