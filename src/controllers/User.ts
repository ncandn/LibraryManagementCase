import { NextFunction, Request, Response } from "express";
import pool from "../db";

export const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await pool.query(
            "SELECT * FROM users;"
        );

        res.json({
            success: true,
            result: users.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uid } = req.params;
        const user = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [uid]
        );

        res.json({
            success: true,
            result: user.rows[0]
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newUser = await pool.query(
            "INSERT INTO users (name) VALUES($1) RETURNING *",
            [name]
        );

        res.json({
            success: true,
            result: newUser.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const BorrowBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uid, bid } = req.params;
        const book = await pool.query(
            "SELECT * FROM book WHERE book_id = $1",
            [bid]
        );

        if (book.rows[0].borrowed) {
            res.json({
                success: false,
                result: {
                    message: `The book with id ${bid} is already borrowed.`
                }
            });

            return next();
        }

        if (!book.rows[0]) {
            res.json({
                success: false,
                result: {
                    message: `Unable to obtain the book with id: ${bid}`
                }
            });

            return next();
        }

        let userBooks = await pool.query(
            "SELECT borrowed_books FROM users WHERE user_id = $1",
            [uid]
        );

        if (!userBooks.rows[0]) {
            res.json({
                success: false,
                result: {
                    message: `Unable to obtain the user books with id: ${uid}`
                }
            });

            return next();
        }

        if (!userBooks.rows[0].borrowed_books) {
            userBooks.rows[0].borrowed_books = [];
        }

        userBooks.rows[0].borrowed_books.push(JSON.stringify(book.rows[0]));

        const user = await pool.query(
            "UPDATE users SET borrowed_books = $1 WHERE user_id = $2 RETURNING *",
            [userBooks.rows[0].borrowed_books, uid]
        );

        await pool.query(
            "UPDATE book SET borrowed = $1, borrowed_times = $2 WHERE book_id = $3",
            [true, book.rows[0].borrowed_times + 1, bid]
        );

        res.json({
            success: true,
            result: user.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const ReturnBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { uid, bid } = req.params;
        const { score } = req.body;

        const user = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [uid]
        );

        const borrowedBooks = user.rows[0].borrowed_books;
        let bookExists = false;
        let bookRating = 0;

        if (!user.rows[0].previous_books) {
            user.rows[0].previous_books = [];
        }

        for (let i = 0; i < borrowedBooks.length; i++) {
            let bookObject = JSON.parse(borrowedBooks[i]);
            if (bookObject.book_id == uid) {
                borrowedBooks.splice(i, 1);
                user.rows[0].previous_books.push(JSON.stringify(bookObject));
                bookRating = (((isNaN(bookObject.rating) ? 0 : bookObject.rating) * (bookObject.borrowed_times || 0)) + score) / bookObject.borrowed_times + 1;
                bookExists = true;
                break;
            }
        }

        if (!bookExists) {
            res.json({
                success: false,
                result: {
                    message: `The book ${bid} does not belong to the user: ${uid}`
                }
            });

            return next();
        }


        const userUpdated = await pool.query(
            "UPDATE users SET borrowed_books = $1, previous_books = $2 WHERE user_id = $3 RETURNING *",
            [borrowedBooks, user.rows[0].previous_books, uid]
        );

        await pool.query(
            "UPDATE book SET borrowed = $1, rating = $2 WHERE book_id = $3",
            [false, (Math.round(bookRating * 100) / 100).toFixed(2), bid]
        );

        res.json({
            success: true,
            result: userUpdated.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};
