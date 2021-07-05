DROP DATABASE IF EXISTS biztime;
CREATE DATABASE biztime;

\c biztime

DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS comp_industries CASCADE;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    title text NOT NULL UNIQUE
);

CREATE TABLE comp_industries (
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    indust_code TEXT NOT NULL REFERENCES industries ON DELETE CASCADE,
    PRIMARY KEY(comp_code, indust_code)
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES  ('apple', 'Apple Computer', 'Maker of OSX.'),
          ('ibm', 'IBM', 'Big blue.'),
          ('ms', 'Microsoft', 'Windoze');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES  ('apple', 100, false, null),
          ('apple', 200, false, null),
          ('apple', 300, true, '2018-01-01'),
          ('ibm', 400, false, null);

INSERT INTO industries
  VALUES  ('ce', 'Consumer Electronics'),
          ('ml', 'Machine Learning' ),
          ('sw', 'Software'),
          ('hw', 'Hardware');

INSERT INTO comp_industries 
  VALUES  ('apple', 'ce'),
          ('apple', 'hw'),
          ('apple', 'sw'),
          ('ibm', 'ml'),
          ('ibm', 'hw'),
          ('ibm', 'sw'),
          ('ms', 'ce'),
          ('ms', 'hw'),
          ('ms', 'sw');