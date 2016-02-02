const bodyParser = require('body-parser');

const router = require('express').Router();
const Book = require('../models/Book');

router.use(bodyParser.json());

//GET all books
router.get('/search', (req, res, next) => {
  Book.find({}).lean().exec( (err, books) => {
    if(err) {
      console.log(err);
      return res.status(500).send(err[0]);
    }
    res.send(books);
  });
});
//GET specific book
router.get('/search/:book_id', (req, res, next) => {
  Book.findById(req.params.book_id).lean().exec( (err, book) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err[0]);
    }
    res.send(book);
  })
});

//POST new book
router.post('/addBook', (req, res, next) => {
    var saved;
  Book.findOne({
    title: req.body.title,
    author: req.body.author
  })
  .then( book => {
    if (!book) {
      var newBook = new Book({
        title: req.body.title,
        author: req.body.author,
        availability: [{user_id: req.user_id}]
      });
      return newBook.save();
    } else {
      book.availability.push({user_id:req.user_id});
      return book.save();
    }
  })
  .then( savedBook => {
    var physicalBook = new PhysicalBook({
      book_id: savedBook._id,
      user_id: req.user_id,
      borrower: 0
    });
    return physicalBook.save();
  })
  .then( savedBook => {
    res.send(savedBook);
  })
  .catch( err => {
    res.status(500).send(err);
  });
});

module.exports = router;