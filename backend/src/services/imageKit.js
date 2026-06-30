// Install: npm install @imagekit/nodejs

import ImageKit from '@imagekit/nodejs';
import {config} from '../config/config.js'

const imageKit = new ImageKit({
    publicKey:config.IMAGEKIT_PUBLIC_KEY,
    privateKey:config.IMAGEKIT_PRIVATE_KEY,
});

export {imageKit}
