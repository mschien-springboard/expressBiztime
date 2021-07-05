DROP DATABASE IF EXISTS biztime_test;
CREATE DATABASE biztime_test;

\c biztime_test

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
