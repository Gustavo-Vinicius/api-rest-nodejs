import fastify from "fastify"
import { knex } from "./database"

const app = fastify()

// GET, POST, PUT, PATCH, DELETE

app.get('/hello', async () => {
    const transaction = await knex('transactions').select('*')

    return transaction
})

app.listen({
    port: 3333 
}).then(() => {
    console.log('HTTP Server Running!')
})