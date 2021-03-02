import { check, sanitize, validationResult } from "express-validator";
import { CallbackError, NativeError } from "mongoose";
import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from "express";
import { User, IUser} from "../model/userModel";
import { IVerifyOptions } from "passport-local";
import passport from "passport";
import "../config/passport"



export const getLogin = (req: Request, res: Response): void => {

    res.send("Login");
};



export const postLogin = async (req: Request, res: Response, next: NextFunction)=> {


    passport.authenticate("local", (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            res.send("/Invalid User");
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); } 
           res.send("Logged IN")
            
        });
    })(req, res, next);
};


export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      res.send({ msg: 'Please enter all fields' }).sendStatus(400);
    }
  
    if (password.length < 6) {
      res.send({ msg: 'Password must be at least 6 characters' });
    }
  
   else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          res.send({msg:"User Exist"});
        } else {
          const newUser = new User({
              name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                    console.log(user);
                    res.send(`Welcome ${newUser.name}`);
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
};
export const getSignup = (req: Request, res: Response) => {

    res.send("Register");
};