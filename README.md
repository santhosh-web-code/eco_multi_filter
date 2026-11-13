# E-Commerce Multi-Filter

Stage 1 establishes the React 18/Vite client and Express API foundation.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Install

From the project root:

```powershell
npm install
```

## Run locally

Start the API and client in separate terminals from the project root:

```powershell
npm run dev:server
```

```powershell
npm run dev:client
```

The client runs on the Vite development server and proxies `/api` requests to
the API on port 3000. The health endpoint is `GET /api/health`.

## Verify

```powershell
npm test
npm run build
npm run lint
```
