const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// const corsConfig = {
//     origin: '',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c1jlj01.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        const toysCollection = client.db('toyDB').collection('toys');

        //Toys Of All
        app.get('/alltoys', async (req, res) => {
            const cursor = toysCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        //Shop By Category

        app.get('/catOne', async (req, res) => {
            const cursor = toysCollection.find({ category: "Teddy Bear" });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/catTwo', async (req, res) => {
            const cursor = toysCollection.find({ category: "Horse" });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/catThree', async (req, res) => {
            const cursor = toysCollection.find({ category: "Dinosaur" });
            const result = await cursor.toArray();
            res.send(result);
        })

        //Toys Each Seller
        app.get('/toys', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const options = {
                sort: { price: 1 },
            };
            const result = await toysCollection.find(query, options).toArray();
            res.send(result);
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(query);
            res.send(result);
        })

        app.post('/toys', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toysCollection.insertOne(newToy);
            res.send(result);
        })

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body;
            const toy = {
                $set: {
                    photo: updatedToy.photo,
                    name: updatedToy.name,
                    seller: updatedToy.seller,
                    email: updatedToy.email,
                    category: updatedToy.category,
                    price: updatedToy.price,
                    rating: updatedToy.rating,
                    quantity: updatedToy.quantity,
                    details: updatedToy.details
                }
            }
            const result = await toysCollection.updateOne(filter, toy, options);
            res.send(result);
        })

        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Toys server is running");
})

app.listen(port, () => {
    console.log(`Toy server is running at port: ${port}`);
})