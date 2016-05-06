const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');

const skyrock = 'http://firewall.pulsradio.com';
const metal = 'http://stream.radiometal.com:8010';

const listen = (radio) => {
    icy.get(radio, (res) => {
        res.on('metadata', (metadata) => {
            const parsed = icy.parse(metadata);
            console.log(parsed.StreamTitle);

            // DOESN'T MATCH DIFOOL
            if (radio !== metal && !parsed.StreamTitle.match(/Difool/)) {
                console.log('change radio');
                res.unpipe();
                listen(metal); // METAL
            }
        });

        res.pipe(new lame.Decoder()).pipe(new Speaker());
    });
};

listen(skyrock);
