const io = require("../app");

io.on('connection',(socket)=>{
    console.log(`user connected-id-${socket.id}`);
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
    socket.on('message',(data)=>{
        io.emit('sendMessage',data)
        // console.log(data);
    })
})