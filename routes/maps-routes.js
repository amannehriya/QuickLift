const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const {query} = require('express-validator');
const {getCordinates, getAutoCompleteSuggestion, getdistancebtw} = require('../controller/map-controller')

router.get('/get-Cordinates',
   query('address').isString().isLength({min:3}) ,
   isLoggedIn.user,getCordinates
)
   
router.get('/get-suggestions',
   query('address').isString(),
   isLoggedIn.user,
   getAutoCompleteSuggestion
)

router.get('/get-distanceBtw',[
   query('origin').isString().isLength({min:3}),
     query('destination').isString().isLength({min:3})
],
   isLoggedIn.user,
  getdistancebtw
)

module.exports = router;
