#!/usr/bin/env node

import 'babel-polyfill';
import icy from 'icy';
import fs from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ silent: true });

(async () => {
    const url = (await fetch(process.env.RADIO_URL)).url;

    await icy.get(url, (res) => {
        res.pipe(fs.createWriteStream('radio.mp3'));
    });
})();
