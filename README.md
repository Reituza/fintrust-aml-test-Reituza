# FinTrust KYC: Suspicious Transaction Flagger

Full-stack application to identify potentially fraudulent transactions using 5 business rules. Backend: Node.js/Express/Sequelize. Frontend: Angular with flat design. Database: PostgreSQL. Containerized with Docker.

## Quick Start

### Backend

```bash
cd app
npm install
npm test
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker Setup

```bash
docker-compose up
```

Backend runs on `http://localhost:3000`  
Frontend runs on `http://localhost:4200`

## Project Structure

```
.
├── app/                    # Node.js backend (Express + Sequelize)
│   ├── models/            # Database models
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Validation & error handling
│   ├── migrations/        # Database schema
│   ├── tests/             # Jest test suite (15 tests)
│   ├── index.js           # Express server
│   ├── package.json
│   └── Dockerfile
├── frontend/              # Angular frontend
│   ├── src/
│   │   ├── app/           # Components, services
│   │   ├── assets/        # Global SCSS styling
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
├── data/                  # Data files
├── docker-compose.yml
├── PERSONAL_THOUGHTS.md   # Project reflections
└── README.md
```

## 5 Suspicious Transaction Rules

1. **High-Risk Young Customer**: Amount > 10,000 ZAR AND age < 25
2. **New Customer Large Transfer**: Amount > 15,000 ZAR AND registered < 30 days ago
3. **High-Risk Suburb**: Destination in 15 pre-defined high-risk suburbs
4. **Suspicious Round Amount**: Amount > 5,000 with endings: 000, 500, 900, 950, 990, 999
5. **Transaction Velocity**: > 3 transactions in 24h totaling > 20,000 ZAR

## API Endpoints

### Customers
- `GET /customers` - List customers with search/pagination
- `GET /customers/:id` - Customer details with total transacted
- `GET /customers/:id/transactions` - Customer transactions with pagination

### Transactions
- `POST /transactions` - Create transaction
- `GET /alerts` - All suspicious transactions (flagged by rules)

## Testing

```bash
cd app
npm test
```

15 tests covering all endpoints and suspicious transaction rules.

## Stack

- **Backend**: Node.js 20, Express.js 4, Sequelize 6, PostgreSQL 15
- **Frontend**: Angular 17, TypeScript 5, SCSS, RxJS
- **Testing**: Jest 29, 15+ test cases
- **Deployment**: Docker & docker-compose

## Database

Tables:
- `customers` - User profiles
- `transactions` - Transaction records
- `high_risk_suburbs` - 15 pre-seeded high-risk locations

## Features

✅ RESTful API with 5 endpoints  
✅ 5 business rule detection  
✅ Input validation & error handling  
✅ Database migrations  
✅ 15 test cases with >85% coverage  
✅ Docker containerization  
✅ Angular frontend with real-time dashboard  
✅ Clean flat design UI  
✅ Global SCSS styling

## Build & Deploy

```bash
# Build
docker-compose up

# Run tests
docker-compose exec app npm test

# Frontend build
cd frontend && npm run build
```
