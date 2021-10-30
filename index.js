const express = require('express');
const { MongoClient, MongoRuntimeError } = require('mongodb');
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ujyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourism_book');
        const placesCollection = database.collection('places');
        const ordersCollection = database.collection('orders');

        // GET places api
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find();
            const places = await cursor.toArray();
            res.send(places);
        });

        // GET orders api
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find();
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // POST api for places
        app.post('/places', async (req, res) => {
            const place = req.body;
            // console.log('Hit the post', place);

            const result = await placesCollection.insertOne(place);
            // console.log(result);
            res.json(result);
        })

        // POST api for orders
        app.post('/orders', async (req, res) => {
            const order = req.body;

            console.log('Hit the post', order);
            const result = await ordersCollection.insertOne(order);
            console.log('server result', result);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})