# Documentação de Arquitetura

## Visão Geral
Este projeto é um sistema web para o estúdio Seven Tattoo, desenvolvido com Next.js, React e TypeScript. Ele oferece uma interface pública para apresentação do estúdio, galeria de tatuagens, informações de contato e uma área administrativa para gerenciamento de mensagens, agendamentos, galeria, analytics e configurações.

## Estrutura de Pastas
- **src/app/**: Páginas públicas e administrativas, rotas de API.
- **src/components/**: Componentes reutilizáveis (UI, layout, seções, admin).
- **src/hooks/**: Hooks customizados para lógica de negócio e UI.
- **src/lib/**: Funções utilitárias, validações, autenticação, manipulação de dados.
- **src/types/**: Tipos TypeScript compartilhados.
- **data/**: Arquivos JSON persistem dados da galeria, configurações, etc.
- **public/**: Assets estáticos (ícones, imagens, service worker).

## Principais Tecnologias
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Jest** (testes)
- **ESLint** (lint)
- **next-auth** (autenticação)
- **react-hook-form** (formulários)
- **zod** (validação)
- **framer-motion** (animações)

## Fluxos e Funcionalidades
- **Público**: Home, Sobre, Galeria, Contato.
- **Admin**: Dashboard, Galeria, Mensagens, Agendamentos, Analytics, Sobre, Configurações.
- **APIs**: CRUD para galeria, mensagens, agendamentos, analytics, settings, autenticação.
- **Persistência**: Dados em arquivos JSON na pasta `data/`.
- **Segurança**: Headers de segurança, autenticação via next-auth, controle de acesso na área admin.

## Componentes Importantes
- **Header/Footer**: Navegação e informações institucionais.
- **AdminSidebar**: Navegação do painel admin.
- **StatsCard**: Métricas no dashboard.
- **Sections**: Hero, About, Gallery, Contact.

## Testes e Qualidade
- Testes unitários com Jest e Testing Library.
- Lint com ESLint e config Next.js.

## Observações
- O projeto segue boas práticas de acessibilidade e responsividade.
- O deploy recomendado é na Vercel.

---

# Manual do Usuário

## Acesso Público
- Navegue pelas seções: Início, Sobre Nós, Galeria, Contato.
- Para orçamentos/agendamentos, utilize o Instagram ou WhatsApp disponíveis no site.

## Área Administrativa
1. Faça login em `/admin/login`.
2. Utilize o menu lateral para acessar:
   - **Dashboard**: Visão geral.
   - **Galeria**: Gerencie fotos de tatuagens.
   - **Mensagens**: Veja e responda contatos.
   - **Agendamentos**: Gerencie solicitações de horários.
   - **Analytics**: Veja estatísticas de acesso.
   - **Sobre Nós**: Edite informações institucionais.
   - **Configurações**: Ajuste dados do estúdio.
3. Para sair, clique em "Sair" no menu.

## Observações
- Apenas usuários autenticados acessam o admin.
- Dados são salvos automaticamente ao editar.

---

# Guia de Desenvolvimento

## Instalação
```bash
npm install
```

## Desenvolvimento
```bash
npm run dev
```
Acesse http://localhost:3000

## Testes
```bash
npm test
```

## Build
```bash
npm run build
```

## Lint
```bash
npm run lint
```

---

# Segurança
- Headers de segurança configurados em `next.config.ts`.
- Autenticação obrigatória para rotas admin e API protegidas.
- Dados sensíveis não ficam expostos no frontend.

---

# Contato
- Instagram: [@seventattoo_ofc](https://www.instagram.com/seventattoo_ofc/)
- WhatsApp: +55 21 96581-3894
- Endereço: Rua Erne - Duque de Caxias, RJ

---

# Licença
Projeto privado. Todos os direitos reservados a Seven Tattoo.
