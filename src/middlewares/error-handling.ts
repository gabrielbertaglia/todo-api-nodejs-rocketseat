import { AppError } from "@/utils/app-error";
import {Request, Response, NextFunction} from "express"
import { ZodError } from "zod";

export function errorHandling(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message
      })
    }

    if(err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        issues: err.format(),
        errors: err.errors
      })
    }

    return res.status(500).json({
      message: err.message
    })
}