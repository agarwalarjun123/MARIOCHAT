var express=require('express');
const socket= require( 'socket.io');
const bodyParser = require('body-parser')
const cookieParser= require('cookie-parser');
const app=express();

app.set("views","./views");
app.set("view engine","ejs");


app.use('/',function(req,res,next){
  res.render('index');

});
var server=app.listen(process.env.PORT,function(err,result){
  console.log("connected");
});
var io=socket(server);
io.on('connection',function(socket){
    socket.on('chat',function(data){
    console.log(data);
    io.sockets.emit('chat',data);
  });
});
