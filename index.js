const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');
const co = require('co');

const skyrock = 'http://firewall.pulsradio.com';
const radiometal = 'http://stream.radiometal.com:8010';
const emission = new RegExp('Difool');

class Radio {
    constructor(channel) {
        this.channel = channel;
    }

    title() {
        return new Promise((resolve) => {
            setTimeout(() => {
                icy.get(this.channel, (res) => {
                    res.on('metadata', (metadata) => {
                        const parsed = icy.parse(metadata);
                        resolve(parsed.StreamTitle);
                    });
                });
            }, 1000);
        });
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
}

const run = function*run() {
    const radioSkyrock = new Radio(skyrock);
    const radioMetal = new Radio(radiometal);

    yield radioSkyrock.listen();

    while (true) {
        const titleRadioSkyrock = yield radioSkyrock.title();
        console.log({ titleRadioSkyrock });

        // LISTEN RADIO METAL
        if (radioSkyrock.state === 'open' && !titleRadioSkyrock.match(emission)) {
            radioSkyrock.close();
            yield radioMetal.listen();
        }

        // LISTEN SKYROCK
        if (radioSkyrock.state === 'close' && titleRadioSkyrock.match(emission)) {
            radioMetal.close();
            yield radioSkyrock.listen();
        }
    }
};

co(run());
