
const express = require('express');
const app = express();
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))



const http = require('http')
const server = http.createServer(app);
const socketIo = require('socket.io');
const { log } = require('console');
const io = socketIo(server);

app.set("view engine","ejs");

var names=[]
var ids=[]



io.on("connection",function(socket){
   
    socket.on("u",function(data){
      names.push(data);
      ids.push(socket.id);
      io.emit("onlineUsers",names)     
    })

    socket.on("message",function(data){
        var idx=ids.indexOf(socket.id)
        io.emit("messageback",{message:data,id:socket.id,name:names[idx]})
      })
  
      socket.on("isTyping",function(typing){
        console.log("sadfhkjh");
        
        let index = ids.indexOf(socket.id);

        if(typing.length>0){
          io.emit("result",{resu:true,name:names[index],id:socket.id})
        }
        else{
          io.emit("result",{resu:false,name:names[index],id:socket.id})
        }
      })

    

})

app.get("/",(req,res)=>{
    res.render("index")
})

server.listen(3000);