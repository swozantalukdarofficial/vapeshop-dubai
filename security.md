# Security Guidelines

- Environment variables strictly stored in `.env.local`
- Zero plain text credentials in client-side code
- SSR guards (`typeof window !== 'undefined'`) for browser APIs
- Strict rate limiting on public API endpoints
