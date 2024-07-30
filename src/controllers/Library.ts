import { NextFunction, Request, Response } from "express";
import pool from "../db";

export const ListBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await pool.query(
            "SELECT * FROM book;"
        );

        res.json({
            success: true,
            result: books.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const GetBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bid } = req.params;
        const book = await pool.query(
            "SELECT * FROM book WHERE book_id = $1",
            [bid]
        );

        res.json({
            success: true,
            result: book.rows[0]
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};

export const CreateBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const newBook = await pool.query(
            "INSERT INTO book (name) VALUES($1) RETURNING *",
            [name]
        );

        res.json({
            success: true,
            result: newBook.rows
        });

        return next();
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
};
