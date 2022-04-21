

// node express setup 
const express = require('express')
let cors = require("cors") 
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
app.use(cors())  

app.use(express.json()) 
const port = process.env.port || 5000

// user:dbuser1
// password:zNoDMwUaH33EKUaF


const uri = "mongodb+srv://dbuser1:zNoDMwUaH33EKUaF@cluster0.jxqey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const userCollection = client.db('foodExpress').collection('user');
    //   temporary user send to mongodb 
        const user = {name: 'john', email: 'john@example'}
        const result = await userCollection.insertOne(user);
        console.log(`get user${result.insertedId}`);


      // data send to client side & create user
      app.post('/user', async (req, res) => {
          const newUser = req.body
          console.log('new user', newUser);
          const result = await userCollection.insertOne(newUser);
          res.send(result)
      })
    //   app.post('/user', async (req, res) => {
    //     const newUser = req.body
    //     console.log('user', newUser)
    //     const result = await userCollection.insertOne(newUser)
    //     res.send(result)
    // })

        // data display in backend multiple
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const result =  await cursor.toArray()
            res.send(result)
        })
  

            // delete user from database
            app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })


            // search particular a single user in backend
            app.get('/user/:id', async (req, res) => {
                const id = req.params.id
                const query = {_id: ObjectId(id)}
                const result = await userCollection.findOne(query);
                res.send(result)
            })



            // updateUser in client side 
            app.put('/user/:id', async (req, res) => {
                const id = req.params.id
                const updateUser = req.body
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        name: updateUser.name,
                        email: updateUser.email
                    }
                };
                const result = await userCollection.updateOne(filter, updateDoc, options);
                res.send(result)
            })


 

    
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)



// node express display send 
app.get('/',(req, res) => {
    res.send('Welcome back Today is going to start mongo !!!')
})


app.listen(port, () => {
    console.log('That is app listening on port',port);
})