import { Router } from "express";

import { GetUsers, GetUser, CreateUser, BorrowBook, ReturnBook } from "../controllers/User";

export default (router: Router) => {
    router.get("/users", GetUsers);
    router.get("/users/:uid", GetUser);
    router.post("/users", CreateUser);
    router.post("/users/:uid/borrow/:bid", BorrowBook);
    router.post("/users/:uid/return/:bid", ReturnBook);
};
