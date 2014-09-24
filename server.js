// Docs :
// https://github.com/TooTallNate/node-icecast
// https://www.npmjs.org/package/radio-stream
// Stream : http://nodejs.org/api/stream.html
// Pipe : http://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
// http://elegantcode.com/2011/04/06/taking-baby-steps-with-node-js-pumping-data-between-streams/

// TODO :
// Stoper le flux audio et le remplacer par un autre (le relire dès que le morceau change)
// Ecrire le flux dans un fichier
// Démarrer un serveur http pour streamer le contenue.

var lame = require('lame');
var icecast = require('icecast');
var Speaker = require('speaker');
var fs = require("fs");
var http = require('http');
var path = require('path');

// URL to a known Icecast stream
var url = 'http://firewall.pulsradio.com';
// var url = "http://95.81.155.6/4779/sky_161307.mp3";

// var req = icecast.request({hostname: 'firewall.pulsradio.com', port: 80, path: '/'}, function(res){
//     console.log(res.headers);
// });

// // write data to request body
// req.write('data\n');
// req.end();

// connect to the remote stream
icecast.get(url, function (res) {

    console.log('Start flux http');

    // log the HTTP response headers
    // console.error(res.headers);

    // log any "metadata" events that happen
    res.on('metadata', function (metadata) {
        title = icecast.parse(metadata).StreamTitle;
        console.log(title);
        if (title == "Ben Feat Susie Preston - Remember Me (Daniel Kandis Remix)") {
            console.log('listen metal music');
            res.unpipe();
            setTimeout(function(){
                icecast.get("http://stream.radiometal.com:8010", function (res) {
                    res.pipe(new lame.Decoder()).pipe(new Speaker());
                });
            }, 2000);
        };
    });

    // res.on('end', function() {
    //     console.log('there will be no more data.');
    // });

    // res.on('data', function(chunk) {
    //     console.log('got %d bytes of data', chunk.length);
    // })

    var w = fs.createWriteStream('pulsradio.mp3');
    var r = fs.createReadStream('pulsradio.mp3');
    res.pipe(w);
    
    // Let's play the music (assuming MP3 data).
    // lame decodes and Speaker sends to speakers!
    res.pipe(new lame.Decoder()).pipe(new Speaker());
});
