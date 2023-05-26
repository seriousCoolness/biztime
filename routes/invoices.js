const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

/** Get list of all invoices. */

router.get('/', async function(req, res, next) {
    try {
        let query_result = await db.query('SELECT id, comp_code FROM invoices;');
        return res.json({'invoices' : query_result.rows});
    } catch(err) {
        
        return next(err);
    }
});

/** Get single invoice based on its id. */

router.get('/:id', async function(req, res, next) {
    try {
        let { id } = req.params;
        let query_result = await db.query(`SELECT * FROM invoices WHERE id=$1;`, [id]);
        if(query_result.rowCount === 0)
            return next(new ExpressError('Could not find invoice with that ID.', 404));
        return res.json({'invoice' : query_result.rows[0]});
    } catch(err) {
        return next(err);
    }
});

/** Post a new invoice. */

router.post('/', async function(req, res, next) {
    try {
        let { comp_code, amt } = req.body;

        let returned_addition = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *;', [comp_code, amt]);
        return res.status(201).json({'invoice' : returned_addition.rows[0]});
    } catch(err) {
        return next(err);
    }
});

/** Updates an existing invoice. */

router.patch('/:id', async function(req, res, next) {
    try {
        let { id } = req.params;
        let { amt } = req.body;

        let query = await db.query(`SELECT * FROM invoices WHERE id=$1;`, [id]);
        if(query.rowCount === 0)
            return next(new ExpressError('Cannot find invoice with that id.', 404));

        let updated_entry = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *;', [amt, id]);
        return res.status(201).json({'invoice' : updated_entry.rows[0]});
    } catch(err) {
        return next(err);
    }
});

/** Deletes an invoice. */
router.delete('/:id', async function(req, res, next) {
    try {
        let { id } = req.params;
        
        let query = await db.query(`SELECT * FROM invoices WHERE id=$1;`, [id]);
        if(query.rowCount === 0)
            return next(new ExpressError('Cannot find invoice with that ID.', 404));

        await db.query('DELETE FROM invoices WHERE id=$1;', [id]);
        return res.json({'status': 'deleted'});
    } catch(err) {
        return next(err);
    }
});

module.exports = router;