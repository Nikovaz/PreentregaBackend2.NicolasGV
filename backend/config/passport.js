import dotenv from 'dotenv';

// Load environment variables from root .env file
dotenv.config({ path: '../.env' });

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'passport-jwt';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Configuración de la estrategia local para el registro y login
passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Usuario no encontrado:', email);
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        console.log('Contraseña ingresada:', password);
        console.log('Hash almacenado:', user.password);

        const isMatch = bcrypt.compareSync(password, user.password);
        console.log('Resultado de la comparación de contraseñas:', isMatch);

        if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
    } catch (error) {
        console.error('Error en la estrategia local:', error);
        return done(error);
    }
}));

console.log('JWT_SECRET desde passport.js:', process.env.JWT_SECRET);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;