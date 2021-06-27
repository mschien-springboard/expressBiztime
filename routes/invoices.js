const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(new ExpressError("Table not found", 404));
    };
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id=$1`, [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice Code: ${id} not found`, 404);
        };
        return res.json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});
// SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        if (!comp_code || !amt || !paid || !add_date || !paid_date) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING comp_code, amt, paid, add_date, paid_date`, [comp_code, amt, paid, add_date, paid_date]);
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name || !description) {
            throw new ExpressError("Missing required data", 400);
        };
        const results = await db.query(
            `UPDATE companies SET id=$1, name=$2, description=$3 
            WHERE id=$1 RETURNING id, name, description`, [id, name, description]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Company Code: ${id} not found`, 404);
        };
        return res.send({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    };
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
        if (results.rowCount === 0) {
            throw new ExpressError(`Invoice Code: ${id} not found`, 404);
        };
        return res.send({ msg: `Deleted Invoice: ${id}` });
    } catch (e) {
        return next(e);
    };
});

module.exports = router;