//Create the server

const express= require('express');
const mongoose=require('mongoose');//communicate to MONGODB through mongoose
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express(); //invoke express


//import routes
const postRoutes=require('./routes/student');
const adminRoutes=require('./routes/admin');
const materialRoutes=require('./routes/materials');

//app middleware
app.use(bodyParser.json());

app.use(cors());

//route middleware
app.use(postRoutes);
app.use(adminRoutes);
app.use(materialRoutes);



const PORT=8000;
const DB_URL='mongodb+srv://hansijk:hansi123@cluster0.maxjh.mongodb.net/StudentManagementSystem?retryWrites=true&w=majority';

mongoose.connect(DB_URL,{
    useNewURLParser:true,
    useUnifiedTopology:true
})
.then(()=>{console.log('DB  connected')})
.catch((err) => {
    console.log('DB connection error :',err);
});


app.listen(PORT,()=>{
    console.log("App is running on" ,PORT);
});

