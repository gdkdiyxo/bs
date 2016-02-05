const router = require('express').Router();
const User = require('../models/User');
const Book = require('../models/Book');
const PhysicalBook = require('../models/PhysicalBook');
const mongoose = require( 'mongoose' );

router.get('/', (req, res, next) => {
  var queries = req.query;
  var searchTerms = Object.keys(queries);
  if (queries.search === 'books'){
    //GET all books
    if (searchTerms.length === 1){
      Book.find({}).populate('availability').lean().exec( (err, books) => {
        if(err) {
          return res.status(500).send(err[0]);
        }
        res.send(books);
      });
    }
    else if (searchTerms.length === 2) {
      //GET a user's book inventory
      if (queries.userId) {
        PhysicalBook.find({owner: queries.userId}).populate('unique_book borrower')
        .then( books => {
          res.send(books);
        })
        .catch( err => {
          res.status(500).send(err[0]);
        });
      }
      //GET a specific unique book
      else if (queries.bookId) {
        Book.findById(queries.bookId).lean().exec( (err, book) => {
          if (err) {
            return res.status(500).send(err[0]);
          }
          res.send(book);
        });
      }
      //handles all other unsupported BOOK queries
      else {
        res.status(404).send('search queries not supported');
      }
    }
  }
  //GET all users
  else if (queries.search === 'users' && searchTerms.length === 1){
    User.find({})
          .lean()
          .exec( (err, users) => {
            if (err) {
              return res.status(500).send(err[0]);
            }
            res.send(users);
          });
  }
  //handles all other unsupported queries
  else {
    res.status(404).send('search queries not supported');
  }
});

module.exports = router;
