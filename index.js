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

        // GET api
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find();
            const places = await cursor.toArray();
            res.send(places);
        });

        // POST api
        app.post('/places', async (req, res) => {
            const place = req.body;
            console.log('Hit the post', place);

            const result = await placesCollection.insertOne(place);
            console.log(result);
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