const express = require('express');
const router = express.Router();
const db = require('../db');
const ExpressError = require('../expressError');

/** Get list of all companies. */
router.get('/', async function(req, res, next) {
    try {
        let query_result = await db.query('SELECT code, name FROM companies;');
        return res.json({'companies' : query_result.rows});
    } catch(err) {
        
        return next(err);
    }
});

/** Get single company based on its company-code. */

router.get('/:code', async function(req, res, next) {
    try {
        let { code } = req.params;
        let query_result = await db.query(`SELECT * FROM companies WHERE code=$1;`, [code]);
        if(query_result.rowCount === 0)
            return next(new ExpressError('Could not find company with that company code.', 404));
        
        let invoices_query = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code]);
        return res.json({'company' : {'code': query_result.rows[0].code, 'name': query_result.rows[0].name, 'description': query_result.rows[0].description, 'invoices': invoices_query.rows}});
    } catch(err) {
        return next(err);
    }
});

/** Post a new company. */

router.post('/', async function(req, res, next) {
    try {
        let { code, name, description } = req.body;

        let returned_addition = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *;', [code, name, description]);
        return res.status(201).json({'company' : returned_addition.rows[0]});
    } catch(err) {
        return next(err);
    }
});

/** Updates an existing company. */

router.patch('/:company', async function(req, res, next) {
    try {
        let { company } = req.params;
        let { code, name, description } = req.body;

        let query = await db.query(`SELECT * FROM companies WHERE code=$1;`, [company]);
        if(query.rowCount === 0)
            return next(new ExpressError('Cannot find company with company code matching URL parameter.', 404));

        let updated_entry = await db.query('UPDATE companies SET code=$1, name=$2, description=$3 WHERE code=$4 RETURNING *;', [code, name, description, company]);
        return res.status(201).json({'company' : updated_entry.rows[0]});
    } catch(err) {
        return next(err);
    }
});

router.delete('/:code', async function(req, res, next) {
    try {
        let { code } = req.params;
        
        let query = await db.query(`SELECT * FROM companies WHERE code=$1;`, [code]);
        if(query.rowCount === 0)
            return next(new ExpressError('Cannot find company with company code matching URL parameter.', 404));

        await db.query('DELETE FROM companies WHERE code=$1;', [code]);
        return res.json({'status': 'deleted'});
    } catch(err) {
        return next(err);
    }
});

module.exports = router;