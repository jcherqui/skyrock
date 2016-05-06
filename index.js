const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');
const co = require('co');

const skyrock = 'http://firewall.pulsradio.com';
const radiometal = 'http://stream.radiometal.com:8010';

const getTitle = (radio) => new Promise((resolve, reject) => {
    setTimeout(() => {
        icy.get(radio, (res) => {
            res.on('metadata', (metadata) => {
                const parsed = icy.parse(metadata);
                if (!parsed.StreamTitle) {
                    reject('Error');
                }
                resolve(parsed.StreamTitle);
            });
        });
    }, 1000);
});

class Radio {
    constructor(channel) {
        this.channel = channel;
    }

    listen() {
        this.reader = new Promise((resolve) => {
            icy.get(this.channel, (res) => {
                res.pipe(new lame.Decoder()).pipe(new Speaker());
                resolve(res);
            });
        });
        return this.reader;
    }

    close() {
        this.reader.then((reader) => {
            this.state = 'close';
            reader.unpipe();
        });
    }
}

const run = function*run() {
    const radioSkyrock = new Radio(skyrock);
    const radioMetal = new Radio(radiometal);

    yield radioSkyrock.listen();

    while (true) {
        const titleRadioSkyrock = yield getTitle(skyrock);
        console.log(titleRadioSkyrock);

        // IF LISTEN RADIO SKYROCK && TITLE DOESN'T MATCH RADIO LIBRE OF DIFOOL
        if (radioSkyrock.state !== 'close' && !titleRadioSkyrock.match(/Difool/)) {
            console.log('change radio');
            radioSkyrock.close();
            yield radioMetal.listen();
        }
    }
};

co(run());
