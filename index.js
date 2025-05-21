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
      const newRecipe = req.body;
      const result = await recipeCollection.insertOne(newRecipe);
      res.send(result);
    })
    // To get all the recipies
     app.get('/recipies', async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    });
    // Delete the data from database
      app.delete('/recipies/:id', async (req, res) => {
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
