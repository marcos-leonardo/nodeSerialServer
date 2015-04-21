function main() {

    "use strict";
    
    // connect to the light bulb server
    var socket = io.connect('http://localhost:8080');
    // 
    socket.on('connect', function () {
        console.log('The server is ready!');
        socket.emit('msg', 'hi');
    });
	

    socket.on('msg', function (data) {
    	// log the message
    	console.log(data);

        var div = document.getElementById('divTemperature');

        //div.innerHTML =  data.temperature+"<strong>&deg;";

        div.innerHTML =  data.temperature+"";

        var div1 = document.getElementById('divHumidity');

       // div1.innerHTML =  data.humidity+"<span> %</span>";
        div1.innerHTML =  data.humidity+"";

    	// send message
    	//socket.emit('msg', 'hi master');
        
        var x = (new Date()).getTime();
        var chart = $('#container').highcharts();
        var series = chart.series[0],
        shift = series.data.length > 40; // shift if the series is 
                                                 // longer than 20
        chart.series[0].addPoint([x, data.sound], true, shift);   
    });
}

window.addEventListener('DOMContentLoaded', main);