const mongoose = require('mongoose');
const SavedLink = mongoose.model('SavedLink');
const randStr = require('randomstring');
const {URL} = require('url');
const parseDomain = require('parse-domain');
const request = require('request');
const cheerio = require('cheerio');

const _doLookup = async (params = {}) => {
  const foundURL = await SavedLink.findOne(params);
  return foundURL ? {url: foundURL.url, idString: foundURL.idString} : false;
};

// If no http(s) prefix is set add one - Required for 301 redirects later
const _urlFix = (url) => {
  if(!url.match(/^http(s?):\/\//)) {
    url = `http://${url}`;
  }
  return url;
};

const _addNewLink = async (url, idString = randStr.generate(7)) => {

  // Stop duplicate lookup strings
  let stringIsUnique = false;

  while(!stringIsUnique) {
    let checkStringExists = await _doLookup({idString: idString});
    if(checkStringExists) {
      idString = randStr.generate(7);
    } else {
      stringIsUnique = true;
    }
  }

  await new SavedLink({
    url: url,
    idString: idString,
    timesVisited: 0
  }).save()

  return {idString: idString};
}


const _getPageMeta = async (url) => {
  return new Promise((resolve, reject) => {
    request(url, (err, resp, html) => {
      if(!err && resp.statusCode === 200) {
        const $ = cheerio.load(html, { xmlMode: true });
        const title = $('title').text();

        // Select an image to represent this page
        let imgSrc;

        // A list of possible images to check
        const possibleImages = [
          {
            'selector': $('link[rel="apple-touch-icon"]'),
            'attribute': 'href'
          },
          {
            selector: $('meta[property="og:image"]'),
            attribute: 'content'
          },
          {
            selector: $('link[rel="icon shortcut"]'),
            attribute: 'href'
          },
          {
            selector: $('link[rel="icon"]'),
            attribute: 'href'
          }
        ];

        let foundImage = false;
        possibleImages.forEach(tag => {
          if(tag.selector.length && !foundImage) {
            imgSrc = tag.selector.attr(tag.attribute);
            foundImage = true;
          }
        });

        // If the image src is relative to the site root we need to include the domain
        if(imgSrc && imgSrc.match(/^\/|^\./)) {
          imgSrc = new URL(imgSrc, url);
        }

        resolve({title: title || url, imgSrc: imgSrc || false});
      } else {
        reject(false);
      }
    });
  });
};


/*
  Called to add a new URL to the system
*/
exports.addURL = async (req, res) => {

  let targetURL = req.body.url;
  let requestKey = req.body.requestKey;

  // If no url or no request key has been passed return an error
  if(!targetURL) {
    return res.status(400).send('Please enter a URL to shorten').end();
  } else if (!requestKey) {
    return res.status(403).send('There was an error making the request').end()
  }

  let toReturn = {idString: '', requestKey: requestKey};

  // Fix url
  targetURL = _urlFix(targetURL);

  // Check the given url contains a valid tld
  const validTLD = parseDomain(targetURL) && parseDomain(targetURL).tld;
  if(!validTLD) {
    return res.status(400).send('Unable to shorten link, Please enter a valid URL').end();
  }

  // Check is this url has already been saved
  const checkExisting = await _doLookup({url: targetURL});

  if(checkExisting) {
    Object.assign(toReturn, {idString: checkExisting.idString});
    return res.json(toReturn).end();
  }

  // If no entry exists for the given url, create a new one
  let idString = req.body.customString || randStr.generate(7);

  const newURL = await _addNewLink(targetURL);

  Object.assign(toReturn, newURL);

  res.json(toReturn).end();
};


/*
  Called to scrape the page given in the URL and return some data
*/
exports.getURLMeta = async (req, res) => {
  const url = req.body.url;

  let targetURL = _urlFix(url);

  let toReturn = {title: '', imgSrc: '', url: targetURL, requestKey: req.body.requestKey};

  // Scrape the given webpage for some nice values
  try {
    const urlMeta = await _getPageMeta(targetURL);
    if(urlMeta) {
      Object.assign(toReturn, urlMeta)
    } else {
      return res.status(404).end();
    };
  } catch(err) {
    toReturn.title = targetURL;
  }

  return res.json(toReturn).end();

};


/*
  Checks the request coming in for a valid id String and tries
  to find a matching url
*/
exports.checkRedirect = async (req, res, next) => {
  const redirectTo = await _doLookup({idString: req.params.id});
  if(redirectTo) {
    await SavedLink.findOneAndUpdate({idString: req.params.id}, { $inc: { timesVisited: 1 }});
    res.redirect(301, redirectTo.url);
  } else {
    // If no match is found we can pass this off to the 'not found' middleware to render an error page
    next();
  }
}
