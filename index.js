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
        app.post('/recipes', async (req, res) => {
            try {
                const newRecipe = {
                    ...req.body,
                    likeCount: 0 
                };
                const result = await recipeCollection.insertOne(newRecipe);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: 'Failed to add recipe' });
            }
        });


        // To get all the recipes
        app.get('/recipes', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result);
        });

        // to get top-recipes
        app.get('/top-recipes', async (req, res) => {
            try {
                const top = await recipeCollection
                    .find({})
                    .sort({ likeCount: -1 })
                    .limit(6)
                    .toArray();
                res.send(top);
            } catch (err) {
                res.status(500).send({ message: "Failed to load top recipes" });
            }
        });

        // Get single recipe
        app.get('/recipes/:id', async (req, res) => {
            const id = new ObjectId(req.params.id);
            const recipe = await recipeCollection.findOne({ _id: id });
            res.send(recipe);
        });

        // Patch like count by 
        app.patch("/recipes/:id/like", async (req, res) => {
            const id = req.params.id;
            try {
                const result = await recipeCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    { $inc: { likeCount: 1 } },
                    { returnDocument: "after" }
                );

                if (!result.value) {
                    return res.status(404).send({ message: "Recipe not found" });
                }

                res.send(result.value);
            } catch (error) {
                res.status(500).send({ message: "Failed to like recipe", error });
            }
        });


        // for getting data by filter
        app.get("/recipes", async (req, res) => {
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
        app.put('/recipes/:id', async (req, res) => {
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
        app.delete('/recipes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await recipeCollection.deleteOne(query);
            res.send(result);
        })

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
