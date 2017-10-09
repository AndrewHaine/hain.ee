const mongoose = require('mongoose');

exports.index = (req, res) => {
  res.render('index', {
    title: 'Hain.ee',
    content: 'Save some bytes, shorten that URL!',
    csrfToken: req.csrfToken()
  });
};
