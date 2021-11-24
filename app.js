require("dotenv").config();
const express = require("express");
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const { getall } = require("./controllers/controllers");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


var storage = multer.diskStorage({  
    destination:(req,file,cb)=>{  
        cb(null,'./public/uploads');  
    },  
    filename:(req,file,cb)=>{  
        cb(null,file.originalname);  
    }  
});  
var upload = multer({storage:storage});  

mongoose.connect("mongodb+srv://"+ process.env.USER + ":" + process.env.PASS + "@cluster0.w9fyl.mongodb.net/ShubhamSangawat?retryWrites=true&w=majority", {useNewUrlParser : true,  useUnifiedTopology: true})
.then(() => {
    console.log("DB CONNECTED");
  });


app.get('/',function(req,res){
    res.render('home');
});

app.post('/upload', upload.single("uploadfile"),getall);

// Import Excel File to MongoDB database


app.listen(3000 ||process.env.PORT, function(){
    console.log("Server started on port 3000");
})
