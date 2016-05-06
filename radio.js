const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');

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

export default Radio;
