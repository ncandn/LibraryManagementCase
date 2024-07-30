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

SELECT * FROM book;

SELECT * FROM users;

INSERT INTO book (name, borrowed, borrowed_times) VALUES('Test Book', false, 0);

INSERT INTO users (name) VALUES('Adam Smith');

SELECT * FROM book WHERE book_id = 1;

SELECT * FROM users WHERE user_id = 1;
