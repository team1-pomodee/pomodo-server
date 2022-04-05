
export class Room  {
  onlineUsers = [];
  roomName = '';
  socket = null;
  io = null
  intervalID = null;
  counter = 0;
  breakDuration = 5000;
  pomodoDuration = 25000;
  duration = 25000
  intervalDuration = 1000
  cycle = 0;
  isPlaying = false;
  percent = 100;
  deleteRoom;
  
  constructor(socket, io, deleteRoom){
    this.socket = socket;
    this.io = io;
    this.deleteRoom = deleteRoom;
  }

  play = () => {
    
    this.intervalID = setInterval(() => {
      this.isPlaying = true;
      if (this.counter === this.duration) {
        this.duration = this.duration === this.pomodoDuration ? this.breakDuration : this.pomodoDuration;
        this.counter = 0;
        this.cycle = this.duration === this.pomodoDuration ? this.cycle + 1 : this.cycle;

        this.percent = Math.floor(this.counter / this.duration * 100);

        this.sendSignalsToSingleUser('timer',  {isPlaying: this.isPlaying, onlineUsers:this.onlineUsers.length, cycle: this.cycle, percent: this.percent, time: this.counter / this.intervalDuration, duration: this.duration});
        return
      }

      this.counter =  this.counter + this.intervalDuration;
      this.percent = Math.floor(this.counter / this.duration * 100)
      this.sendSignalsToSingleUser('timer',  {isPlaying: this.isPlaying, onlineUsers: this.onlineUsers.length, cycle: this.cycle, percent: this.percent, time: this.counter / this.intervalDuration , duration: this.duration});

    }, this.intervalDuration);
  }

  pause = () => {
    this.isPlaying = false;
    clearInterval(this.intervalID);
    this.sendSignalsToSingleUser('timer',  {isPlaying: this.isPlaying, onlineUsers: this.onlineUsers.length, cycle: this.cycle, percent: this.percent, time: this.counter / this.intervalDuration , duration: this.duration});
  }

  reset = () => { 
    this.pause()
    this.isPlaying = false;
     
    this.intervalID = null;
    this.counter = 0;
    this.breakDuration = 5000;
    this.pomodoDuration = 25000;
    this.duration = 25000
    this.intervalDuration = 1000
    this.cycle = 0;
    this.isPlaying = false;
    this.percent = 0;

    clearInterval();
    this.sendSignalsToSingleUser('timer',  {isPlaying: this.isPlaying, onlineUsers:this.onlineUsers.length, cycle: this.cycle, percent: 100, time: this.counter / this.intervalDuration , duration: this.duration});
  }



  closeRoom = async () => { 
    // kick all users out of the room except the creator
    
    await this.sendSignalsToSingleUser("new user", []);
    
    this.onlineUsers = []
   
    this.reset();
    console.log(`${this.roomName} has been deleted`);
  };


  setRoomName = (roomName) => {
    this.roomName = roomName;
  }

  setAdmin = (user) => { 
    const onlineUsers = this.onlineUsers.map((data) => {
      if (data.username === user.username && data.username !== this.roomName) {
        return { ...data, hasControl: data.hasControl ? false : true }
      } 

      return data;
    });

    this.onlineUsers = onlineUsers;
    this.sendSignalsToSingleUser("new user", this.onlineUsers)
  }

  removeUser = (userSocketId) => {

    const remainingOnlineUsers = this.onlineUsers.filter((data) => data.id !== userSocketId)

    if (remainingOnlineUsers.length > 0) {
      this.onlineUsers = remainingOnlineUsers

  
        this.io.to(this.roomName).emit("new user", remainingOnlineUsers)
   

    }
  }

  setJoiningUsers = (user) => {
    const onlineUser = this.onlineUsers.find((data) => data.username === user.username)

    if (!onlineUser) {
      this.onlineUsers.push(user)
    } else {
      const remainingOnlineUsers = this.onlineUsers.filter((data) => data.username !== user.username)
      remainingOnlineUsers.push({ ...onlineUser, ...user })

      this.onlineUsers = remainingOnlineUsers;
    }

    setTimeout(() => {
      // in case the user list update is not reflected in the client
      this.sendSignalsToSingleUser("new user", this.onlineUsers);
      this.sendSignalsToSingleUser('timer',  {isPlaying: this.isPlaying, cycle: this.cycle, percent: this.percent, onlineUsers:this.onlineUsers.length, time: this.counter / this.intervalDuration , duration: this.duration});
    }, 2000)
     
  }

  sendSignalsToSingleUser = async (signalName, data) => { 
    //todo: move this to sendSignalsToAllUser
    this.onlineUsers.forEach((user) => {
        this.io.to(user.id).emit(signalName, data)
    })
  }

  getRoomName = () => {
    return this.roomName;
  }

  logout = (roomName) => { 
    this.closeRoom();
    this.deleteRoom(roomName);
    console.log(`${roomName} has been deleted`);
  }

}


