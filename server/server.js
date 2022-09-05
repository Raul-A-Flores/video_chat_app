const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
});

app.use(cors())
PORT = process.env.PORT 

app.get('/', (req, res) => {
    res.send('Sever is up and running');

});

io.on('connection', (socket) => {

    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconnected');
    });

    socket.on('callUser', ({userToCall, signalData, from , name})=>{
        io.to(userToCall).emit('callUser' ,{ signal: signalData, from, name})
    });

    socket.on('acceptCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });

});

server.listen(process.env.PORT, () => console.log(`Server listening on port ${PORT}`))