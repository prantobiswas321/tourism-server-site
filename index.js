const express = require('express');
const { MongoClient, MongoRuntimeError } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


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

        app.get('/places', async (req, res) => {
            const result = await placesCollection.find({}).toArray();
            // console.log(result);
            res.send(result);
        })


        app.get('/order/:id', async (req, res) => {
            const result = await placesCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        })

        app.post('/userOrder', async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.send(result);
        })

        // last one
        app.get('/userOrder', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })

        app.get('/allOrders', async (req, res) => {

            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })

        app.delete('/deleteOrder/:id', async (req, res) => {
            const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.send(result);
        })

        app.get('/myOrders/:email', async (req, res) => {
            const result = await ordersCollection.find({ userEmail: req.params.email }).toArray();
            res.send(result);
        })

        // POST api for places
        app.post('/places', async (req, res) => {
            const place = req.body;
            // console.log('Hit the post', place);

            const result = await placesCollection.insertOne(place);
            // console.log(result);
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