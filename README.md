# E-Commerce Multi-Filter

Monorepo foundation for an e-commerce filtering application. The client uses
React 18 and Vite; the API uses Node.js and Express with ES modules.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Install

From the repository root:

```powershell
npm run install:all
```

## Run both applications

Copy `server/.env.example` to `server/.env` if you want to customize the local
server configuration, then run:

```powershell
npm run dev
```

The client is available at `http://localhost:5173`. The API listens on
`http://localhost:5000`, and Vite proxies `/api` requests to it.

## Verify

```powershell
npm test
```

The health endpoint is `GET /api/health`.
