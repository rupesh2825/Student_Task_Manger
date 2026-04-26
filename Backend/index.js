const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Database is connected');
    startServer();
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

const userSchema = mongoose.Schema({
  task: String,
  detail: String,
  status: String,
  deadline: String
});

const Stud = mongoose.model('Stud', userSchema);

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/', async (req, res) => {
  try {
    const result = await Stud.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.post('/add', async (req, res) => {
  const { task, detail, status, deadline } = req.body;
  try {
    const result = await Stud.create({ task, detail, status, deadline });
    res.status(200).json({ message: 'created successfully' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.put('/update/:id', async(req,res)=>{
  const {id}=req.params;
  const { task, detail, status, deadline } = req.body;
  try{
    const result = await Stud.findByIdAndUpdate(id,{task,detail,status,deadline})
    res.status(200).json({massage:"Updated Successfully"})
  }catch(err){
    res.status(500).json({ message: err });
  }
})

app.delete("/delete/:id", async(req,res)=>{
  const {id}=req.params
    try{
        const reslut = await User.findByIdAndDelete(id)
        res.status(200).json({message:'deleted successfuly'})
    }catch(err){
        res.status(500).json({message : err})
    }
})

function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

