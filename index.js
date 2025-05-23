const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER_RECIPE}:${process.env.DB_PASS_RECIPE}@cluster0.tmx4o0d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        const recipeCollection = client.db('RecipeDB').collection('recipe')

        // send data to db/ Post 
        app.post('/recipies', async (req, res) => {
            try {
                const newRecipe = {
                    ...req.body,
                    likeCount: 0  // eta manually set koro
                };
                const result = await recipeCollection.insertOne(newRecipe);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to add recipe' });
            }
        });


        // To get all the recipies
        app.get('/recipies', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result);
        });
        // Get single recipe
        app.get('/recipies/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const recipe = await recipeCollection.findOne({ _id: id });
            res.send(recipe);
        });
        // For updating likeCount by +1
        app.put('/recipies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: { likeCount: 1 }
            }
            const result = await recipeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })
        // for getting data by filter
        app.get("/recipies", async (req, res) => {
            const { cuisine } = req.query;
            try {
                let query = {};
                if (cuisine && cuisine !== "All") {
                    query.cuisineType = cuisine;
                }

                const recipes = await recipeCollection.find(query);
                res.json(recipes);
            } catch (err) {
                res.status(500).json({ message: "Server Error", error: err });
            }
        });





        // Update any data from previous data
        app.put('/recipies/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: updatedCoffee
            }
            const result = await recipeCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })
        // Delete the data from database
        app.delete('/recipies/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await recipeCollection.deleteOne(query);
            res.send(result);
        })
        // for like count 







        // To confirm Connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Add your Recipe ')
});

app.listen(port, () => {
    console.log(`Recipe server is running on port ${port}`)
});
