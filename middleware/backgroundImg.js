/**
  We want to request a random image from unsplash and cache it for a day
*/

/**
  Dependencies
*/
const http = require('https');
const cache = require('memory-cache');

/**
  Set up some variables
*/
const defaultValues = {
  "urls": {
    "regular": 'https://images.unsplash.com/photo-1500229285422-9508ce34dedc?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max'
  },
  "user": {
    "name": 'Michael Heuser',
    "links": {
      "html": 'https://unsplash.com/@gum_meee?utm_source=hain.ee&utm_medium=referral&utm_campaign=api-credit'
    }
  }
};
const cacheKey = '__express__unsplash';
const cacheDuration = 43200000; // 12 Hours
const unsplashUTM = '?utm_source=hain.ee&utm_medium=referral&utm_campaign=api-credit';

/**
  The_Function
*/
module.exports = async (req, res, next) => {
  const url = `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_APPID}`;
  let imageData;

  if(cache.get(cacheKey)) {
    imageData = JSON.parse(cache.get(cacheKey));
  } else {
    try {
      const newImageData = await getNewImage(req, res, url);
      imageData = JSON.parse(newImageData);
    } catch (e) {
      console.error('Background Image Middleware Error: ' + e.message);
      imageData = defaultValues;
    }
  }

  res.locals.backgroundImageUrl = imageData.urls.regular;
  res.locals.backgroundImageUserName = imageData.user.name;
  res.locals.backgroundImageUserUrl = imageData.user.links.html + unsplashUTM;

  next();
};

/**
  Make a request to Unsplash and cache the response for a day
*/
const getNewImage = (req, res, url) => {
  return new Promise((resolve, reject) => {
    let rawData = '';
    const unsplashRequest = http.get(url, res => {
      res.on('data', (imageData) => {

        rawData += imageData;

        cache.put(cacheKey, rawData, cacheDuration);

      });
      res.on('end', () => resolve(rawData));
    });

    unsplashRequest.on('error', err => {
      reject(new Error(err));
    });
  })
}
