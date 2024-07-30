import { Router } from "express";

import { GetBook, ListBooks, CreateBook } from "../controllers/Library";

export default (router: Router) => {
    router.get("/books", ListBooks);
    router.get("/books/:id", GetBook);
    router.post("/books", CreateBook);
};
