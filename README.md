# Token Town — Prize Counter

A small full-stack shop where you spend virtual **tokens** on arcade prizes:
browse the catalogue, add and remove items, adjust quantities, and redeem
everything in one checkout that deducts from your token balance.

Built to demonstrate a modern TypeScript stack end to end.

## Stack

| Layer      | Tech                                            |
| ---------- | ----------------------------------------------- |
| Frontend   | React + TypeScript (Vite)                       |
| Backend    | Node.js + Express, RESTful API (TypeScript)     |
| Database   | PostgreSQL via Prisma ORM                       |
| Cloud      | Azure (App Service + PostgreSQL + Static Web Apps) |
| Versioning | Git + GitHub                                    |

## Project layout

```
token-town/
├── server/                 # Express + Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma    # Product, CartItem, Wallet, Order, OrderItem
│   │   └── seed.ts          # loads prizes + a 300-token wallet
│   └── src/
│       ├── index.ts         # app entry
│       ├── prisma.ts        # shared Prisma client
│       ├── wallet.ts        # get-or-create wallet helper
│       └── routes/          # products, wallet, cart, checkout, orders
└── client/                 # React + Vite frontend
    └── src/
        ├── api.ts           # typed fetch wrapper
        ├── App.tsx          # state + data fetching
        └── components/      # ProductGrid, CartDrawer, WalletBadge, Toast
```

## API

| Method | Route                     | Purpose                                   |
| ------ | ------------------------- | ----------------------------------------- |
| GET    | `/api/products`           | List prizes                               |
| GET    | `/api/wallet`             | Current token balance                     |
| POST   | `/api/wallet/topup`       | Add tokens (`{ amount }`, default 50)     |
| GET    | `/api/cart`               | Cart contents + total                     |
| POST   | `/api/cart`               | Add/increment (`{ productId, quantity? }`)|
| PATCH  | `/api/cart/:productId`    | Set exact quantity (0 removes)            |
| DELETE | `/api/cart/:productId`    | Remove an item                            |
| POST   | `/api/checkout`           | Redeem cart → order, deduct tokens        |
| GET    | `/api/orders`             | Redemption history                        |

Checkout runs inside a Prisma transaction so the order, wallet, and cart
always stay consistent, and returns `402` if the balance can't cover the total.

## Run it locally

You need Node.js 18+ and a running PostgreSQL instance.

### 1. Backend

```bash
cd server
cp .env.example .env          # then edit DATABASE_URL to match your Postgres
npm install
npx prisma migrate dev --name init   # creates the tables
npm run seed                  # loads prizes + wallet
npm run dev                   # API on http://localhost:4000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                   # app on http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so no extra config is needed.

## Deploy to Azure

Three pieces: a database, the API, and the static frontend.

### Database — Azure Database for PostgreSQL (Flexible Server)
1. Create a Flexible Server in the Azure Portal.
2. Copy its connection string into the API's `DATABASE_URL` (append
   `?sslmode=require`).
3. From your machine, point `DATABASE_URL` at it and run:
   `npx prisma migrate deploy && npm run seed`.

### API — Azure App Service (Linux, Node 20)
1. Create a Web App, deploy the `server/` folder (via GitHub Actions or `az webapp up`).
2. Set application settings: `DATABASE_URL`, and `CORS_ORIGIN` = your frontend URL.
3. Startup command: `npm run build && npm start` (App Service sets `PORT`).
   `prisma generate` runs automatically via the `postinstall` script.

### Frontend — Azure Static Web Apps
1. Create a Static Web App linked to your GitHub repo, app root `client`.
2. Build command `npm run build`, output location `dist`.
3. Add an app setting `VITE_API_URL` = your App Service URL
   (e.g. `https://token-town-api.azurewebsites.net`).

## Push to GitHub

```bash
git init
git add .
git commit -m "Token Town — full-stack prize shop"
git branch -M main
git remote add origin https://github.com/<you>/token-town.git
git push -u origin main
```

---

*Virtual tokens only — no real currency or payments are involved.*
