const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');
const co = require('co');

const skyrock = 'http://firewall.pulsradio.com';
const radiometal = 'http://stream.radiometal.com:8010';

class Radio {
    constructor(channel) {
        this.channel = channel;
    }

    listen() {
        this.reader = new Promise((resolve) => {
            icy.get(this.channel, (res) => {
                res.pipe(new lame.Decoder()).pipe(new Speaker());
                this.state = 'open';
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

    title() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                icy.get(this.channel, (res) => {
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
    }
}

const run = function*run() {
    const radioSkyrock = new Radio(skyrock);
    const radioMetal = new Radio(radiometal);

    yield radioSkyrock.listen();

    while (true) {
        const titleRadioSkyrock = yield radioSkyrock.title();
        console.log(titleRadioSkyrock);

        // IF LISTEN RADIO SKYROCK && TITLE DOESN'T MATCH RADIO LIBRE OF DIFOOL
        if (radioSkyrock.state === 'open' && !titleRadioSkyrock.match(/Difool/)) {
            console.log('change radio');
            radioSkyrock.close();
            yield radioMetal.listen();
        }
    }
};

co(run());
