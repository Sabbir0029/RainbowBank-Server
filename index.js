const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dywnj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('Rainbow-Bank');
      const userCollection = database.collection('User');
     // GET
    app.get('/users/:email', async (req,res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({admin: isAdmin });
    })
  
    app.post('/users', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user)
      res.json(result);
    })
  
    // 
    app.put('/users', async(req,res)=>{
      const user = req.body;
      const filter = {email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.json(result);
    })
  
    // put
    app.put('/users/admin', async (req,res)=>{
      const user = req.body;
      console.log('Put', user);
      const filter = {email: user.email };
      const updateDoc = { $set: {role:'admin'} };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    })
  
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

