const express = require('express');
const bodyParser = require('body-parser');

//cross origin(front-bankend communication) communication
const cors = require('cors')
const { connectToDatabase, getDatabase } = require('./db');

const app = express();
const PORT = 4000;

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

app.use(cors())

// const mid=(req,res,next)=>{
// console.log("midileware is working")
// res.setHeader("Access-Control-Allow-Origin","*")
// res.setHeader("Access-Control-Allow-Headers","*")
// res.setHeader("Access-Control-Allow-Methods","*")
// next()

// }

// app.use(mid)
//Connect to the MongoDB database
connectToDatabase();

app.post('/signUp',async(req,res)=>{
  try {
   // console.error('Request Body:', req.body);
    const db = getDatabase();
    const collection = db.collection('my_collection');

   // console.log(getData())
    const data = req.body;
    const email=data.email
    const result = await (await collection.findOne({email}));
   
    if(result){
      console.log("result",result)
      res.status(400).json({ message: 'This email id is already present' });
      return
    }
    await collection.insertOne(data);
    res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/login',async(req,res)=>{
  try{
    const data=req.body;
    
    const db = getDatabase();
    const collection = db.collection('my_collection');

    const query={email:data.email}
    console.log("promise pendig check")
    
    // Fetch all users from the collection
    const result = await collection.findOne(query);
    try{
    if(result){
       console.log("in result")
     if(result.password===data.password){
      res.status(200).send({message:`${result.name} logedin`,result:result})
     }
     else{
      res.status(500).json({message:'password incorrect'})
     }

    }
    else
    res.status(500).json({message:'userId not found'})
    }
   catch(er){
    res.status(500).json({message:'userId not found'})
   }
   // console.log(result)
  
    //res.status(200).json({ data: result });
}
catch(er){
   console.log("somthing went worng")
   res.status(500).json({ message: 'Internal server error' });
}
})

// Define your API routes here
app.post('/sendData', async (req, res) => {
  try {
    console.error('Request Body:', req.body);
    const db = getDatabase();
    const collection = db.collection('my_collection');
    console.log("this mail has send by prop",req.body.email)
    const data = req.body;
    const email=data.email
    //data.email=""
   // console.log("test",collection)
     collection.updateOne( {email:email},{ $push: { blogCollection: { title: data.title,  author: data.author, discription: data.discription, blog: data.blog } } })
     console.log("i am checking this data",data)
   {/* </value> await collection.insertOne(data); */}
   res.status(200).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/getData/:key',async (req,res)=>{
  try{
       const key=req.params.key;
       console.log(key)
       const db = getDatabase();
       const collection = db.collection('my_collection');

       const query={email:key}
       
       // Fetch all users from the collection
       const result = await (await collection.find(query)).toArray();

       console.log(result)
       res.status(200).json({ data: result });
  }
   catch(er){
      console.log("somthing went worng")
      res.status(500).json({ message: 'Internal server error' });
   }
})

app.get('/getData', async (req, res) => {
  try {
    const db = getDatabase();
    const collection = db.collection('my_collection');
    
    // Fetch all users from the collection
    const result = await (await collection.find({})).toArray();
    res.status(200).json({ data: result });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/deleteData/:key',async (req,res)=>{
  try{
       const key=req.params.key;
       console.log(key)
       const db = getDatabase();
       const collection = db.collection('my_collection');
      

       const query={name:key};
       
       // Fetch all users from the collection s
       const result = await (await collection.deleteOne(query));

       console.log(result)
       res.status(200).json({ data:"deleted" });
  }
   catch(er){
      console.log("somthing went worng",er)
      res.status(500).json({ message: 'Internal server error' });
   }
})

app.patch('/updateData',async (req,res)=>{
  try{
      
       const db = getDatabase();
       const collection = db.collection('my_collection');

       console.log('Request Body:', req.body);
       const query={name:req.body.name}
       
       // Fetch all users from the collection
       const result = await (await collection.updateOne(query,{$set:{name:req.body.newName}}));

       console.log(result)
       res.status(200).json({ data:"updated" });
  }
   catch(er){
      console.log("somthing went worng")
      res.status(500).json({ message: 'Internal server error' });
   }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});