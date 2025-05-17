const io = require("../app");
const user = require("../model/registerSchema");
let isAdminOnline = false;
io.on('connection', async (socket) => {
  console.log(`user connected-id-${socket.id}`);

  let username = "Anonymous"; 
  let isAdmin = false; 

  socket.on('join', async ({ userId }) => {
    try {
      const userData = await user.findOne({ _id: userId });

      if (userData) {
        username = userData.name;
        isAdmin = userData.role === 'admin'; 
        console.log(`User with ID ${userId} joined via socket ${socket.id}`);
        
        if (isAdmin) {
          isAdminOnline = true;
          io.emit('adminStatus', { isOnline: true }); 
        }
        else{
            isAdminOnline = false;
          io.emit('adminStatus', { isOnline: false }); 
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  });

  socket.on('message', (data) => {
    io.emit('sendMessage', { data, username, isAdmin }); // isAdmin will now be available
  });

 socket.on('disconnect', () => {
  if (isAdmin) {
    isAdminOnline = false;
    io.emit('adminStatus', { isOnline: false });
    console.log('Admin disconnected');
  }
  console.log('user disconnected');
});

});
