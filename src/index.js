#!/usr/bin/env node

import 'babel-polyfill';
import co from 'co';
import config from 'config';
import Radio from './radio';

const run = function* run() {
    const radioSkyrock = new Radio(config.skyrock_url);
    const radioMetal = new Radio(config.radiometal_url);

    yield radioSkyrock.listen();

    while (true) {
        const titleRadioSkyrock = yield radioSkyrock.title();
        console.log({ titleRadioSkyrock });

        // LISTEN RADIO METAL
        if (radioSkyrock.state === 'open' && !titleRadioSkyrock.match(new RegExp(config.emission))) {
            radioSkyrock.close();
            yield radioMetal.listen();
        }

        // LISTEN SKYROCK
        if (radioSkyrock.state === 'close' && titleRadioSkyrock.match(new RegExp(config.emission))) {
            radioMetal.close();
            yield radioSkyrock.listen();
        }
    }
};

co(run());
