const socketio = require('socket.io');
const userModel = require('./models/user-model');
const captainModel = require('./models/captain-model');

let io;

function initializeSocket(server) {
    io = socketio(server, {
        cors: {
            origin: "*",
            method: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`client connected:${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
console.log("join",userType)
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id })
            }
        });

        socket.on('update-location-captain',async(data)=>{
            
            const {userId,location} = data;
// console.log(location)
            if(!location || !location.ltd || !location.lng){
               return socket.emit('error',{error:["invalid location data"]})
            }

         await captainModel.findByIdAndUpdate(userId,{
                location:{
                    lat:location.ltd,
                    lon:location.lng
                }
            })
           
        })

        socket.on('disconnected',()=>{
            console.log(`client disconnected: ${socket.id}`);
        })

    })
}

const sendMessageToSocketId = (socketId,messageObject)=>{
    console.log(messageObject);

    if(io){
        io.to(socketId).emit(messageObject.event,messageObject.data)
    }else{
        console.log('socket io is not initialized.');
    }
}

module.exports = {initializeSocket,sendMessageToSocketId};
