const app=require('express').Router();


app.get('/test/:name1/:name2',(req,res,next)=>{
res.render("index",{
name1:req.params.name1,
name2:req.params.name2
});
});
//rendering of login page
app.get('/',function(req,res,next){
  res.render('login');
});


module.exports=app;
