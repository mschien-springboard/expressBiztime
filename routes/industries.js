const express = require("express");
const slugify = require('slugify');
const router = express.Router();
const ExpressError = require("../expressError");
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const indResults = await db.query(`
        SELECT i.title, c.code FROM industries AS i
        LEFT JOIN comp_industries as ci
        ON i.code = ci.indust_code
        LEFT JOIN companies AS c
        ON c.code = ci.comp_code
        `);

        // const { title, code} = 
        industries = results.rows;
        console.log(results.rows);
        return res.json({
            industries: {

            }
        });
    } catch (e) {
        return next(new ExpressError("Table not found", 404));
    };
});

router.get('/:code', async (req, res, next) => {
    try {
        // const compResult = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`, [code]);
        const compResult = await db.query(`
            SELECT c.code, c.name, c.description, i.title
            FROM companies AS c 
            LEFT JOIN comp_industries AS ci 
            ON c.code = ci.comp_code
            LEFT JOIN industries AS i
            ON ci.indust_code = i.code
            WHERE c.code = $1;`, [req.params.code]);
        const invResult = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [req.params.code]);
        if (compResult.rows.length === 0) {
            throw new ExpressError(`Company Code: ${req.params.code} not found`, 404);
        };

        const { code, name, description } = compResult.rows[0];
        const industries = compResult.rows.map(r => r.title)
        const invoices = invResult.rows;

        return res.json({
            company: {
                "company": {
                    code,
                    name,
                    description,
                    invoices,
                    industries
                }
            }
        });

    } catch (e) {
        return next(e);
    };
});


router.post('/', async (req, res, next) => {
    try {
        const { title } = req.body;
        const matches = title.match(/\b(\w)/g).join('');
        const slugCode = slugify(matches, { lower: true });
        if (!slugCode || !title) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `INSERT INTO industries (code, title) 
        VALUES ($1, $2) 
        RETURNING code, title`, [slugCode, title]);
        return res.status(201).json({ Industry: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.put('/:code', async (req, res, next) => {
    try {
        const { title } = req.body;
        const { code } = req.params;
        if (!code || !title) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `UPDATE industries SET code=$1, title=$2 
            WHERE code=$1 RETURNING code, title`, [code, title]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Industry Code: ${code} not found`, 404);
        };
        return res.status(201).json({ Industry: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`DELETE FROM industries WHERE code=$1 RETURNING code`, [code]);
        if (results.rowCount === 0) {
            throw new ExpressError(`Industry Code: ${code} not found`, 404);
        };
        return res.send({ msg: `Deleted Industry: ${code}` });
    } catch (e) {
        return next(e);
    };
});

module.exports = router;