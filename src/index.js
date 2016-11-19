#!/usr/bin/env node

import 'babel-polyfill';
import co from 'co';
import Radio from './radio';

const skyrock = 'http://icecast.skyrock.net/s/natio_aac_64k';
const radiometal = 'http://stream.radiometal.com:8010';
const emission = new RegExp('Difool');

const run = function* run() {
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
