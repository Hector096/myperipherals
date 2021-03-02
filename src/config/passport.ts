import passport from "passport"
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import {User,IUser} from '../model/userModel'
import {  NativeError } from "mongoose";
import { Request, Response, NextFunction } from "express";
import _ from "lodash";

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: NativeError, user: IUser) => {
        done(err, user.id);
    });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err: NativeError, user: IUser) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        bcrypt.compare(password, user.password, (err: NativeError, isMatch:Boolean) => {
            if (err) throw done(undefined, false, { message: `${err}`});
            if (isMatch) return done(undefined, user)
            else return done(undefined, false, { message: 'Invalid Password!' })
        });
    });
}));





/**
 * Login Required middleware.
 */

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};





/**
 * Authorization Required middleware.
//  */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    const user = req.user as IUser;
    if (_.find(user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};