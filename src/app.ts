import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";

import router from "./app/routes";
import sendResponse from "./app/shared/sendResponse ";
import Status from "http-status";
import cookieParser from "cookie-parser";
import jsonSyntaxErrorHandler from "./app/errors/jsonSyntaxErrorHandler";
const app: Application = express();

app.use(cors());

//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Welcome to the API Of Kotoky",
    data: null, // No data to send
  });
});

// route
app.use("/api/v1", router);

// Catch JSON syntax errors
app.use(jsonSyntaxErrorHandler);
//global error handler
app.use(globalErrorHandler);
//Testing

export default app;
