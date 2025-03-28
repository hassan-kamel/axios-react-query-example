# Axios React Query Example

A comprehensive example demonstrating best practices for data fetching using Axios and React Query.

## Project Structure

```
src/
├── api/
│   ├── axiosClient.ts      # Axios instance and interceptor configuration
│   ├── endpoints.ts        # API endpoint definitions
│   └── queryClient.ts      # React Query client configuration
├── pages/                  # Page components
│   ├── products/
│   │   ├── components/     # Product-specific components
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductCard.tsx
│   │   └── queries/       # Product-specific queries
│   │       └── ProductQueries.ts
│   ├── orders/
│   │   ├── components/     # Order-specific components
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── OrderCard.tsx
│   │   └── queries/       # Order-specific queries
│   │       └── OrderQueries.ts
│   └── users/
│       ├── components/     # User-specific components
│       │   ├── UserList.tsx
│       │   ├── UserDetail.tsx
│       │   ├── UserForm.tsx
│       │   └── UserCard.tsx
│       └── queries/       # User-specific queries
│           └── UserQueries.ts
├── services/              # API service layer
│   ├── ProductService.ts
│   ├── OrderService.ts
│   └── UserService.ts
├── types/                # TypeScript interfaces and types
│   └── index.ts
└── components/           # Shared components
    ├── layout/          # Layout components
    │   ├── Sidebar.tsx
    │   └── Header.tsx
    └── shared/          # Reusable components
        ├── Pagination.tsx
        └── ErrorBoundary.tsx
```

## Features

- Centralized API configuration with Axios
- Efficient data fetching and caching with React Query
- TypeScript support
- Error handling and retry logic
- Authentication token management
- Request/Response interceptors
- Global error notifications
- Pagination support
- Form handling
- Optimistic updates
- Real-time data synchronization

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- JSON Server (Mock API)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/axios-react-query-example.git
cd axios-react-query-example
```

2. Install dependencies:

```bash
npm install
```

3. Start the mock API server:

```bash
cd server
npm install
npm start
```

4. In a new terminal, start the development server:

```bash
npm run dev
```

## Development

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_APP_BASE_URL=http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code

## Best Practices

### Code Organization

- Feature-based folder structure
- Separation of concerns
- Reusable components and hooks
- Type safety with TypeScript

### Data Fetching

- Centralized API configuration
- Query caching and invalidation
- Optimistic updates
- Error handling and retries

### UI/UX

- Responsive design
- Loading states
- Error boundaries
- Form validation

## API Documentation

The mock API server provides the following endpoints:

- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/users` - User management

Each endpoint supports standard CRUD operations.

## License

MIT

```

```
