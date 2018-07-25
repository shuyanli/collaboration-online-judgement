const express = require('express');
const app = express();
const restRouter = require('./routes/rest');
const path = require('path');
const mongoose = require('mongoose');

var http = require('http');
var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);

mongoose.connect('mongodb://shuyanli:toREVENGE911015@ds147890.mlab.com:47890/problems');

app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));
app.use((req, res) =>{
    res.sendFile('index.html', {root:path.join(__dirname, '../public')});
});

//app.listen(3000, () => console.log('OJ App runs on port 3000'));
const server = http.createServer(app);
io.attach(server);
server.listen(3000);

server.on('listening', onListening);

function onListening () {
    console.log('OJ App runs on port 3000');
}