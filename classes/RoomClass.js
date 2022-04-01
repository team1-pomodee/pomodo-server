
export class Room  {
  onlineUsers = [];
  roomName = '';
  socket = null;

  constructor(socket){
    this.socket = socket;
  }

  play = () => { 
    interval = setInterval(() => {

      timer = timer + 1;

    }, timer === duration ? breakDuration : duration);
  }

  pause = () => {
    clearInterval(interval);

  }

  reset = () => { 
    clearInterval(interval);
    
  }

  closeRoom = () => { 
    clearInterval(interval);
    //distroy socket room
  };

  getOnlineUsers = () => { 
    clearInterval(interval);
    //distroy socket room
    return this.onLineUsers;
  };


  setRoomName = (roomName) => {
    this.roomName = roomName;
  }

  setAdmin = (user) => { 
    const onlineUsers = users.map((data) => {
      if (data.id === user.id) {
        io.to(user.roomName).emit("control", data.hasControl ? false : true)
        return { ...data, hasControl: data.hasControl ? false : true }
      } 
    });
    this.onlineUsers = onlineUsers;
    io.to(this.roomName).emit("new user", onlineUsers)
  }


  removeUser = (userSocketId) => {

    const remainingOnlineUsers = this.onlineUsers.filter((data) => data.id !== userSocketId)
    if (onlineUsers.length > 0) {
      this.onlineUsers = remainingOnlineUsers

      setTimeout(() => {    
        // in case the user is still in the room
        io.to(this.roomName).emit("new user", remainingOnlineUsers)
      }, 2000)
      
    }
  }


  setJoiningUsers = (user) => { 
      const isUserExist = this.onlineUsers.find((data) => data.username === user.username)

      if (!isUserExist) {
        this.onlineUsers.push(user)
      }
  }


  sendSignalsToAllUser = (signal) => { 
    clearInterval(interval);
    //distroy socket room
     this.onLineUsers.map(() => {
       io.to(this.roomName).emit("timer", {time: 0, users: this.onLineUsers})
     })
  }

  sendSignalsToOneUser = (signal) => { 
    clearInterval(interval);
    //distroy socket room
     this.onLineUsers.map(data => {
      if(data.id === signal.id){
        io.to(this.roomName).emit("timer", {time: 0, users: this.onLineUsers})
      }
    })
  }

  getRoomName = (roomName) => {
    return roomName;
  }

  getOneOnlineUser = (signal) => { 
    let user = {};
    //distroy socket room
    this.onLineUsers.map(data => {
      if (data.username === signal.username) {
        user = data;
      }
    });

    return user;
  }

 

}


