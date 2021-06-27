const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies ORDER BY name`);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(new ExpressError("Table not found", 404));
    };
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const compResult = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`, [code]);
        const invResult = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [code]);
        if (compResult.rows.length === 0) {
            throw new ExpressError(`Company Code: ${code} not found`, 404);
        };
        const company = compResult.rows[0];
        const invoices = invResult.rows;
        company.invoices = invoices.map(i => i.id);

        return res.json({ company: company });
    } catch (e) {
        return next(e);
    };
});


router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        if (!code || !name || !description) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
        VALUES ($1, $2, $3) 
        RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `UPDATE companies SET code=$1, name=$2, description=$3 
            WHERE code=$1 RETURNING code, name, description`, [code, name, description]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Company Code: ${code} not found`, 404);
        };
        return res.send({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING code`, [code]);
        if (results.rowCount === 0) {
            throw new ExpressError(`Company Code: ${code} not found`, 404);
        };
        return res.send({ msg: `Deleted Company: ${code}` });
    } catch (e) {
        return next(e);
    };
});

module.exports = router;