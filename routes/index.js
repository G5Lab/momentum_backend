// created by Pedro 14/01/20

const express = require('express');
const router = express.Router();

// Response to index page
router.get('/',(req,res)=>res.json({ status: true, message: 'This express server is live and working', data: 'Null'}));

module.exports = router;