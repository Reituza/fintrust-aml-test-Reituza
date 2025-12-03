# FinTrust KYC Backend

REST API for flagging suspicious transactions based on 5 business rules.

## Stack

Node.js, Express, PostgreSQL, Sequelize, Docker, Jest

## Setup

```bash
cd app
npm install
cp .env.example .env
npx sequelize-cli db:migrate --config config.js
npm start
```

## Docker

```bash
docker-compose up -d
```

## Tests

```bash
npm test
```

## API

**Customers**
```bash
curl http://localhost:3000/customers
curl http://localhost:3000/customers/1
curl http://localhost:3000/customers/1/transactions
```

**Transactions**
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{"customer_id": 1, "amount": 5000, "destination_suburb": "Johannesburg"}'
```

**Alerts**
```bash
curl http://localhost:3000/alerts
```

## Rules

1. Amount > 10,000 ZAR and customer age < 25
2. Amount > 15,000 ZAR and customer registered < 30 days ago
3. Destination suburb in high-risk list
4. Round amount > 5,000 ZAR with endings (000, 500, 900, 950, 990, 999)
5. Same customer with >3 transactions in 24h totaling > 20,000 ZAR

## Database

- customers
- transactions
- high_risk_suburbs
 
## When testing 
- please remove the files genrated with Remove-Item -Path "coverage" -Recurse -Force 