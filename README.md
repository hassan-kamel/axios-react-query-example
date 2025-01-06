# Axios React Query Example

A comprehensive example demonstrating best practices for data fetching using Axios and React Query.

## Project Structure

```
src/
├── api/
│   ├── axiosClient.ts      # Axios instance and interceptor configuration
│   ├── endpoints.ts        # API endpoint definitions
│   └── queryClient.ts      # React Query client configuration
├── services/              # API service layer
│   ├── ProductService.ts
│   ├── OrderService.ts
│   └── UserService.ts
├── queries/              # React Query hooks
│   ├── ProductQueries.ts
│   ├── OrderQueries.ts
│   └── UserQueries.ts
├── types/               # TypeScript interfaces and types
│   └── index.ts
└── components/         # React components
    ├── products/
    ├── orders/
    └── users/

## Features

- Centralized API configuration with Axios
- Efficient data fetching and caching with React Query
- TypeScript support
- Error handling and retry logic
- Authentication token management
- Request/Response interceptors
- Global error notifications

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a .env file:
```bash
REACT_APP_BASE_URL=your_api_url_here
```

3. Start the development server:
```bash
npm start
```

## Best Practices

- Separation of concerns between API calls, business logic, and UI
- Centralized error handling
- Type safety with TypeScript
- Efficient caching with React Query
- Clean and maintainable code structure
