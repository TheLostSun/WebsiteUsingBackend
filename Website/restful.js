const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid } = require('uuid');
const dotenv = require("dotenv")
dotenv.config({ path: 'config.env' });
const mongoose=require("mongoose");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGO_URI).then(()=> console.log("DB CONNECTED!"))
.catch((err)=> console.log(err))


const blogdata=require("./model")


app.get('/comments',async (req, res) => {

    const comments=await blogdata.find();
    
    res.render('index', { comments });
});



app.get('/comments/new', (req, res) => {
    res.render('new');
});



app.post('/comments', async (req,res)=>{

    const {title, desc,markdown} = req.body;
    const newcomment=new blogdata(
        {
            title:title,
            description:desc,
            markdown:markdown,
            date:new Date(),
            id:uuid(),
        }
    )
     
    const ans=await newcomment.save()



  

    res.redirect('/comments');

})



app.get('/comments/:commentid', async (req,res)=>{

    const {commentid} = req.params;
    const comment=await blogdata.findOne({id:commentid});
       
res.render('show', {comment})

})

// Get edit form prefilled with the data
app.get('/comments/:commentid/edit',async (req,res)=>{

    const {commentid} = req.params;


     const comment=await blogdata.findOne({id:commentid});
    res.render('edit', {comment})

})


app.patch('/comments/:commentid',async (req,res)=>{

    const {commentid} = req.params;

    const comment=await blogdata.findOne({id:commentid});
    comment.title = req.body.title;
    comment.description = req.body.description;
    comment.markdown = req.body.markdown;
    await comment.save()

    res.redirect('/comments')

})



app.delete('/comments/:commentid', async (req,res)=>{

    const {commentid} = req.params;
    const ress=await blogdata.findOneAndDelete({id:commentid})
  
    res.redirect('/comments')

})


app.listen(3000,()=>{
    console.log('server started at port 3000');
  });