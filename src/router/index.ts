import express, { Router } from "express";

import library from "./library";
import user from "./user";

const router = express.Router();

export default (): Router => {
    library(router);
    user(router);
    return router;
};
