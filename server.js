var icy = require('icy');
var lame = require('lame');
var Speaker = require('speaker');

var url = "http://127.0.0.1:8000";

icy.get(url, function (res) {

    res.on('metadata', function (metadata) {
        var parsed = icy.parse(metadata);
        var title = parsed.StreamTitle;

        res.unpipe();
        if (title == "Epoch - Fen - Epoch") {
            // Change url
        }

        res.pipe(new lame.Decoder())
            .pipe(new Speaker());
    });

}); 

