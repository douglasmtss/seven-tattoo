# Rotas e APIs

## Rotas Públicas
- `/` — Página inicial
- `/#sobre` — Sobre o estúdio
- `/#galeria` — Galeria de tatuagens
- `/#contato` — Contato

## Rotas Administrativas
- `/admin` — Dashboard
- `/admin/gallery` — Gerenciamento da galeria
- `/admin/messages` — Mensagens recebidas
- `/admin/appointments` — Agendamentos
- `/admin/analytics` — Estatísticas de acesso
- `/admin/about` — Sobre o estúdio (admin)
- `/admin/settings` — Configurações gerais
- `/admin/login` — Login de administrador

## Rotas de API
- `/api/gallery` — CRUD da galeria
- `/api/gallery/[id]` — Item específico da galeria
- `/api/messages` — CRUD de mensagens
- `/api/messages/[id]` — Mensagem específica
- `/api/appointments` — CRUD de agendamentos
- `/api/appointments/[id]` — Agendamento específico
- `/api/analytics` — Eventos de analytics
- `/api/settings` — Configurações do estúdio
- `/api/contact` — Envio de mensagens de contato
- `/api/auth/[...nextauth]` — Autenticação (next-auth)

## Observações
- Todas as rotas de API protegidas exigem autenticação para métodos de escrita (POST, PUT, DELETE).
- Dados são persistidos em arquivos JSON na pasta `data/`.
- As rotas públicas consomem dados via funções utilitárias em `src/lib/data.ts`.

---

# Estrutura dos Dados

## GalleryItem
```ts
{
  id: string;
  url: string;
  title: string;
  description?: string;
  visible: boolean;
  createdAt: string;
}
```

## ContactMessage
```ts
{
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}
```

## Appointment
```ts
{
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
```

## StudioSettings
```ts
{
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  tiktok: string;
  about: { title: string; content: string };
  businessHours: Record<string, string>;
}
```

---

# Observações Técnicas
- Para detalhes de tipos, veja `src/types/index.ts`.
- Para lógica de dados, veja `src/lib/data.ts`.
- Para autenticação, veja `src/lib/auth.ts` e rotas de API.
