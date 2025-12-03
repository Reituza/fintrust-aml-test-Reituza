const request = require('supertest');
const express = require('express');
const { sequelize, Customer, Transaction, HighRiskSuburb } = require('../models');
const routes = require('../routes');

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Customer Routes', () => {
  beforeEach(async () => {
    await Customer.destroy({ where: {} });
  });

  test('GET /customers returns paginated customers', async () => {
    await Customer.create({
      name: 'John Doe',
      email: 'john@example.com',
      dob: '1990-01-15',
      registered_at: new Date(),
      suburb: 'Sandton'
    });

    const res = await request(app).get('/customers');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data.length).toBe(1);
  });

  test('GET /customers with search filter', async () => {
    await Customer.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      dob: '1992-05-20',
      registered_at: new Date(),
      suburb: 'Johannesburg'
    });

    const res = await request(app).get('/customers?search=jane');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Jane Smith');
  });

  test('GET /customers/:id returns customer details', async () => {
    const customer = await Customer.create({
      name: 'Bob Wilson',
      email: 'bob@example.com',
      dob: '1985-03-10',
      registered_at: new Date(),
      suburb: 'Pretoria'
    });

    const res = await request(app).get(`/customers/${customer.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob Wilson');
  });

  test('GET /customers/:id returns 404 for non-existent customer', async () => {
    const res = await request(app).get('/customers/999');
    expect(res.status).toBe(404);
  });
});

describe('Transaction Routes', () => {
  let customerId;

  beforeEach(async () => {
    await Transaction.destroy({ where: {} });
    await Customer.destroy({ where: {} });

    const customer = await Customer.create({
      name: 'Test Customer',
      email: 'test@example.com',
      dob: '1990-01-01',
      registered_at: new Date(),
      suburb: 'Sandton'
    });
    customerId = customer.id;
  });

  test('POST /transactions creates a transaction', async () => {
    const res = await request(app).post('/transactions').send({
      customer_id: customerId,
      amount: 5000,
      destination_suburb: 'Johannesburg'
    });

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe('5000.00');
    expect(res.body.destination_suburb).toBe('Johannesburg');
  });

  test('POST /transactions validates required fields', async () => {
    const res = await request(app).post('/transactions').send({
      customer_id: customerId
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /transactions rejects negative amounts', async () => {
    const res = await request(app).post('/transactions').send({
      customer_id: customerId,
      amount: -1000,
      destination_suburb: 'Johannesburg'
    });

    expect(res.status).toBe(400);
  });

  test('POST /transactions rejects non-existent customer', async () => {
    const res = await request(app).post('/transactions').send({
      customer_id: 999,
      amount: 5000,
      destination_suburb: 'Johannesburg'
    });

    expect(res.status).toBe(404);
  });

  test('GET /customers/:id/transactions returns transactions for customer', async () => {
    await Transaction.create({
      customer_id: customerId,
      amount: 3000,
      destination_suburb: 'Pretoria',
      created_at: new Date()
    });

    const res = await request(app).get(`/customers/${customerId}/transactions`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('Suspicious Transaction Rules', () => {
  let youngCustomerId, newCustomerId, normalCustomerId;

  beforeEach(async () => {
    await Transaction.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await HighRiskSuburb.destroy({ where: {} });

    const youngCustomer = await Customer.create({
      name: 'Young Customer',
      email: 'young@example.com',
      dob: '2005-01-01',
      registered_at: new Date(),
      suburb: 'Sandton'
    });
    youngCustomerId = youngCustomer.id;

    const newCustomer = await Customer.create({
      name: 'New Customer',
      email: 'new@example.com',
      dob: '1980-01-01',
      registered_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      suburb: 'Johannesburg'
    });
    newCustomerId = newCustomer.id;

    const normalCustomer = await Customer.create({
      name: 'Normal Customer',
      email: 'normal@example.com',
      dob: '1980-01-01',
      registered_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
      suburb: 'Pretoria'
    });
    normalCustomerId = normalCustomer.id;

    await HighRiskSuburb.create({ suburb: 'Hillbrow' });
  });

  test('Rule 1: Flags transaction > 10000 for customer age < 25', async () => {
    await Transaction.create({
      customer_id: youngCustomerId,
      amount: 11000,
      destination_suburb: 'Sandton',
      created_at: new Date()
    });

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].reasons).toContain('Rule 1');
  });

  test('Rule 2: Flags transaction > 15000 for customer < 30 days old', async () => {
    await Transaction.create({
      customer_id: newCustomerId,
      amount: 16000,
      destination_suburb: 'Johannesburg',
      created_at: new Date()
    });

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].reasons).toContain('Rule 2');
  });

  test('Rule 3: Flags transaction to high-risk suburb', async () => {
    await Transaction.create({
      customer_id: normalCustomerId,
      amount: 5000,
      destination_suburb: 'Hillbrow',
      created_at: new Date()
    });

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].reasons).toContain('Rule 3');
  });

  test('Rule 4: Flags round amounts > 5000 with suspicious endings', async () => {
    await Transaction.create({
      customer_id: normalCustomerId,
      amount: 10000,
      destination_suburb: 'Sandton',
      created_at: new Date()
    });

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('Rule 5: Flags velocity - >3 txns in 24h totaling >20000', async () => {
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      await Transaction.create({
        customer_id: normalCustomerId,
        amount: 6000,
        destination_suburb: 'Sandton',
        created_at: new Date(now.getTime() - i * 1000)
      });
    }

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.some(a => a.reasons.includes('Rule 5'))).toBe(true);
  });

  test('No alert for legitimate transaction', async () => {
    await Transaction.create({
      customer_id: normalCustomerId,
      amount: 2000,
      destination_suburb: 'Sandton',
      created_at: new Date()
    });

    const res = await request(app).get('/alerts');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
