// const mongoose = require('mongoose');

exports.index = (req, res) => {
  res.render('index', {
    title: 'Welcome to my new node website!',
    csrfToken: req.csrfToken()
  });
};

exports.addURL = (req, res) => {
  res.render('index', {
    title: 'Bravo!!'
  });
};
