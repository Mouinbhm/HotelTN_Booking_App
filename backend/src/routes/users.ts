import express, { NextFunction, Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        res.status(400).json({ message: "User already registered" });
        return;
      }

      user = new User(req.body);
      await user.save();

      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        res.status(500).json({ message: "JWT secret key is not defined" });
        return;
      }

      const token = jwt.sign({ userId: user._id }, secretKey as string, {
        expiresIn: "1d",
      });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Something went wrong",
        error: (err as Error).message,
      });
      return next();
    }
  }
);

export default router;
