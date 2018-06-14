const express=require('express');
const socket= require( 'socket.io');
const bodyParser = require('body-parser')
const cookieParser= require('cookie-parser');
const app=express();
const morgan=require('morgan');
var arr=[];

app.set("views","./views");
app.set("view engine","ejs");

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false }));

app.use(express.static('public'));

//routes for rendering of login and
app.use(require("./routes/user"));

app.post('/chatroom',(req,res,next)=>{
var c=0;
//checking if the user exists
for(var i=0;i<arr.length;i++)
{
  if(req.body.name==arr[i].name)
   c=1;
}
//if exists redirects to '/'
if(c==1){
c=0;
res.redirect('/');
}
//else renders user.ejs
else
res.render('user',{name:req.body.name});
});


//rendering of login page





const server=app.listen(process.env.PORT||3000,()=>{
  console.log("Listening on localhost:3000");
});



var io=socket(server);
//socket eventemitters


//io.sockets.emit---> all the nodes including the recieving node
//io.broadcast.emit--->all the nodes other than the sender
//socket.to(socketid)--->particular socket



io.on('connection',(socket)=>{
console.log('made socket connection '+ socket.id);

//event handlers for socket
socket.on('change',(data)=>{
  console.log(data);
  var details={
    name:data.name,
    s_id:socket.id
  };
  arr.push(details);
  io.sockets.emit('users',{users:arr});
});
//req event handlerss
socket.on('req',(data)=>{
  console.log(data);
  for(var user of arr)
  if(user.name==data.name2)
   var s2id=user.s_id;

  socket.to(s2id).emit('req',{
    msg:data.name1+" want to chat with you",
    name:data.name1
        });
});



//event listener for users event for add users to the chatroom page

socket.on('users',(data)=>{
var details={
    name:data.name,
    s_id:socket.id
};
arr.push(details);
console.log(arr);
io.sockets.emit('users',{users:arr});
});
//event listener for chat event


socket.on('chat',(data)=>{
for(var i=0;i<arr.length;i++)
  {
    if(arr[i].name==data.name){
      socket.to(arr[i].s_id).emit('chat',data);
      socket.emit('chat',data);

   }
  }
});


//event handler for ack
socket.on('ack',(data)=>{
  for(var i=0;i<arr.length;i++)
    {
      if(arr[i].name==data.name2){
        socket.to(arr[i].s_id).emit('ack',{
          name1:data.name1,name2:data.name2
        });

}
    }

});
//logout event
socket.on('logout',(data)=>{
console.log(data);
for(var user of arr)
if(user.name==data.name2)
socket.to(user.s_id).emit("logout",{name1:data.name1,name2:data.name2});
});

//disconnect
socket.on('disconnect',()=>{
for(var i=0;i<arr.length;i++)
if(arr[i].s_id==socket.id)
arr.splice(i,1);

console.log(arr);

io.sockets.emit('users',{users:arr});

console.log('socket closed');
});
socket.on('typing',(data)=>{
  for(var i=0;i<arr.length;i++)
    {
      if(arr[i].name==data.name)
        socket.to(arr[i].s_id).emit('typing',data);
    }

});
});
