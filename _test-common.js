/** code common to tests. */

const db = require("./db");


async function createData() {
  await db.query("DELETE FROM comp_industries");
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM industries");
  await db.query("SELECT setval('invoices_id_seq', 1, false)");

  await db.query(
    `INSERT INTO companies (code, name, description)
      VALUES  ('apple', 'Apple', 'Maker of OSX.'),
              ('ibm', 'IBM', 'Big blue.')`);
  await db.query(
    `INSERT INTO industries (code, title)
                  VALUES  ('ce', 'Consumer Electronics'),
                          ('ml', 'Machine Learning'),
                          ('sw', 'Software'),
                          ('hw', 'Hardware')`);

  await db.query(
    `INSERT INTO comp_industries (comp_code, indust_code)
                  VALUES  ('apple', 'ce'),
                          ('apple', 'hw'),
                          ('apple', 'sw'),
                          ('ibm', 'ml'),
                          ('ibm', 'hw'),
                          ('ibm', 'sw')`);

  const inv = await db.query(
    `INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
      VALUES  ('apple', 100, false, '2021-07-04', null),
              ('apple', 200, true, '2018-02-01', '2018-02-02'), 
              ('ibm', 300, false, '2018-03-01', null)
              RETURNING id`);



}


module.exports = { createData };
