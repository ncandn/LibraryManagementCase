CREATE DATABASE librarycasestudy;

CREATE TABLE book(
    book_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    rating NUMERIC(5,2),
    borrowed BOOLEAN,
    borrowed_times INTEGER
);

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    borrowed_books TEXT[],
    previous_books TEXT[]
);
