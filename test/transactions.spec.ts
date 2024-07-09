import { it, beforeAll, afterAll, describe, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('Transactions routes', () => {

    beforeAll(async () => {
        console.log('Starting app...');
        await app.ready();
        console.log('App is ready');
    });

    afterAll(async () => {
        console.log('Closing app...');
        await app.close();
        console.log('App is closed');
    });

    it('should be able to create a new transaction', async () => {
        console.log('Starting test for creating a new transaction');
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })
            .expect(201);
        console.log(response.get('Set-Cookie'))
        console.log('Test for creating a new transaction completed');
    }, 10000); // Aumenta o tempo limite do teste para 10 segundos

    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            throw new Error('No cookies returned from the create transaction response');
        }

       const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    
        
        console.log(listTransactionsResponse.body)

    }, 10000)

    it('should be able to get a especific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        if (!cookies) {
            throw new Error('No cookies returned from the create transaction response');
        }

       const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', cookies)
            .expect(200)
        
        const transactionId = listTransactionsResponse.body.transactions[0].id
        
        const getTransactionsResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionsResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        )
    
        
        console.log(listTransactionsResponse.body)

    }, 10000)

    it('should be able to get the summary', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'Credit transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .send({
                title: 'Debit transaction',
                amount: 2000,
                type: 'debit',
            })

        if (!cookies) {
            throw new Error('No cookies returned from the create transaction response');
        }

       const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)
            .expect(200)

        expect(summaryResponse.body.summary).toEqual({
            amount: 5000,
            })
    }, 10000)
})