const express = require('express');
const router = express.Router();
const db = require('../db');

/** Get list of all companies. */
router.get('/companies', function(req, res, next) {
    try {
        //let query_result = await db.query('SELECT * FROM companies;');
        //return res.json({'companies' : query_result.rows});
        return res.json({'all': 'Clear.'});
    } catch(err) {
        if(err)
            return next(err);
    }
});

/** Get single company based on ID. */

module.exports = router;