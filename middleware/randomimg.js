/**
  We want to request a random image from unsplash and cache it for a day
*/

/**
  Dependencies
*/
const rp = require('request-promise');
const cache = require('memory-cache');


module.exports = randomimg;


/**
 * Middleware function - this gets called by express
 *
 * This middleware adds several items to 'res.locals' that will make
 * an image from the unsplash api available to all templates, including all the
 * necessary data to comply with the API terms of service.
 *
 * In order to use this middleware you will need your own unsplash developer account and app
 * which will give you an App ID which needs to be included in the application environment
 * ( Pass it as an option in the use method E.g. app.use(randomimg({unsplashID: xxxx })) )
 *
 * @param {Object} options options for this app
 * @return {Function} middleware function
 */
function randomimg(options = {}) {


  /**
   * Set up some variables
   * Add some defaults and rely on destructuring for the rest
   */
  const {
    cacheKey = '__express__unsplash',
    cacheDuration = 43200000,
    unsplashID,
    unsplashUTM
  } = options;

  // If no default image was set use a previosly found one
  const defaultImage = {
    "urls": {
      "regular": "https://images.unsplash.com/photo-1500229285422-9508ce34dedc?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max"
    },
    "user": {
      "name": 'Michael Heuser',
      "links": {
        "html": `https://unsplash.com/@gum_meee${unsplashUTM}`
      }
    }
  }

  /**
   * Return the function to be called for this middleware
   *
   * @param {Object} req Express request object
   * @param {Object} res Express response object
   * @param {Function} next Continues the middleware chain
   */
  return async (req, res, next) => {

    // Blank image data object
    let imageData = {};

    // Check the cache for stored image data
    const cachedImage = getCachedImageData(cacheKey);

    if(cachedImage) {

      // If there was a stored image set the image data to this value
      imageData = cachedImage;

    } else {

      try {

        // await a response from unsplash and set the image data to the returned value
        imageData = await requestNewImage(unsplashID);

        // cache the returned image data
        setCachedImageData(cacheKey, imageData, cacheDuration);

      } catch(e) {

        // If all else fails use the default image
        imageData = defaultImage;

        // Log an error to see if we can debug what went wrong
        console.error(`Background Image Middleware Error:  ${e.message}`);

      }

    }

    // Pass the image data down in res.locals
    res.locals.backgroundImageUrl = imageData.urls.regular;
    res.locals.backgroundImageUserName = imageData.user.name;
    res.locals.backgroundImageUserUrl = imageData.user.links.html + unsplashUTM;

    return next();

  }
};

/**
 * Store some image data in memory
 * @param {String} cacheKey Key for storing the data against
 * @param {Object} imageData Data to store
 * @param {Number} cacheDuration Expiry duration for this cache
 */
function setCachedImageData(cacheKey, imageData, cacheDuration) {
  return cache.put(cacheKey, imageData, cacheDuration);
}


/**
 * Make a request to the cache and return any stored image data
 * @param {String} cacheKey
 */
function getCachedImageData(cacheKey) {
  return cache.get(cacheKey);
}

/**
 * Make a request to Unsplash and cache the response for a day
 * @param {String} appId Your unsplash app id
 * @return {Object} request-promise object
 */
function requestNewImage(appId) {

  // Set up some options for our request
  const requestOptions = {
    uri: 'https://api.unsplash.com/photos/random/',
    qs: {
      client_id: appId
    },
    json: true
  };

  return rp(requestOptions);

};
