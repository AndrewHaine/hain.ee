/**
  We want to request a random image from unsplash and cache it for a day
*/

/**
  Dependencies
*/
const http = require('https');
const request = require('request').defaults({encoding: null});
const cache = require('memory-cache');

/**
  Set up some variables
*/
const defaultValues = {
  "urls": {
    "regular": "https://images.unsplash.com/photo-1500229285422-9508ce34dedc?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max"
  },
  "user": {
    "name": 'Michael Heuser',
    "links": {
      "html": "https://unsplash.com/@gum_meee?utm_source=hain.ee&utm_medium=referral&utm_campaign=api-credit"
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

  res.locals.backgroundImageUrl = imageData.encodedImage || imageData.urls.regular;
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
      res.setEncoding('utf8');

      if(res.statusCode !== 200) {
        reject(new Error(res.statusMessage));
      }

      res.on('data', (imageData) => {

        rawData += imageData;

      });
      res.on('end', async () => {
        rawData = JSON.parse(rawData);
        rawData["encodedImage"] = await getRawImage(rawData.urls.regular);
        rawData = JSON.stringify(rawData);
        cache.put(cacheKey, rawData, cacheDuration);
        resolve(rawData)
      });
    });

    unsplashRequest.on('error', err => {
      reject(new Error(err));
    });
  })
};

/**
  Encode the image so it can be included in a data-url
  The advantage of this is we can cache the value on the server
  instead of every new user triggering a http request to unsplash
*/
const getRawImage = url => {
  return new Promise((resolve, reject) => {
    request.get(url, (err, resp, body) => {
      if(!err && resp.statusCode === 200) {
        const contentType = resp.headers['content-type'];
        const encodedImage = new Buffer(body).toString('base64');
        resolve(`data:${contentType};base64,${encodedImage}`);
      }
      reject(err);
    })
  });
};
