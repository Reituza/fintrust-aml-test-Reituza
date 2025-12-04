# FinTrust KYC Frontend

Angular frontend for the Suspicious Transaction Flagger application.

## Features

- Dashboard with transaction alerts overview
- Customer search and list view
- Transaction creation form
- Global flat design styling with SCSS
- Real-time API integration with backend

## Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard.component.ts/html/scss
│   │   │   ├── customers.component.ts/html/scss
│   │   │   └── transaction.component.ts/html/scss
│   │   ├── services/
│   │   │   └── api.service.ts
│   │   ├── app.component.ts/html/scss
│   │   └── app.module.ts
│   ├── assets/
│   │   └── styles/
│   │       ├── _variables.scss
│   │       └── global.scss
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```

## Build

```bash
npm run build
```

Output: `dist/fintrust-kyc-frontend`
