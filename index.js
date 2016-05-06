const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');

const url = 'http://firewall.pulsradio.com';
// const metal = 'http://stream.radiometal.com:8010';

icy.get(url, (res) => {
    res.on('metadata', (metadata) => {
        const parsed = icy.parse(metadata);
        if (parsed.StreamTitle.match(/e/)) {
            console.log('change radio');
        }
    });

    // content = res;
    res.pipe(new lame.Decoder()).pipe(new Speaker());
});
