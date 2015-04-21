"use strict";

// Web server (to configure the web server open "webServer.js")
var ip   = undefined;
var port = 8080;
var server = require('./webServer').start(ip, port);

// Web sockets (to configure the webSocket server open "socketServer.js")
var io = require('./socketServer').start(server);

// Firmata
//var serialPort = '/dev/ttyACM0';
//var board = require('./firmataConnector').start(serialPort);

// Serial Port
var serialport = require('serialport'),// include the library
SerialPort = serialport.SerialPort, // make a local instance of it
// get port name from the command line:
portName = process.argv[2]

var myPort = new SerialPort(portName, {
   baudRate: 9600,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 });

myPort.on('open', showPortOpen);
myPort.on('data', saveLatestData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}
 
function saveLatestData(data) {

   console.log(data);
   var res = data.split(",",3);

   var humidity = parseFloat(res[0]);
   var temperature = parseFloat(res[1]);
   var sound = parseFloat(res[2]);

   io.sockets.emit('msg', {username:'test',humidity:humidity,temperature:temperature,sound:sound});

}
 
function showPortClose() {
   console.log('port closed.');
}
 
function showError(error) {
   console.log('Serial port error: ' + error);
}

var userCounter = 0;

// WebSocket connections
io.sockets.on('connection', function (socket) {
        
        userCounter++;

        //socket.emit('msg', {username:socket.username, message:'Connected '+userCounter});
        
        console.log('client connected: '+ socket.id);
        
        socket.on('disconnect', function () {            
            console.log('client disconnected: '+ socket.id);
            userCounter--;
        });

        socket.on('msg', function (data) {
            // log the message
            //console.log(data);
            // send message
            //socket.emit('msg',{username:socket.username, message:'hi slave'});
    });
});
