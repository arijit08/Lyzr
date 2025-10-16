import {Static, Type} from '@sinclair/typebox';
import {AUTH_CONFIG} from "../config/constants";

export const LoginBodySchema = Type.Object({
    username: Type.String({ minLength: AUTH_CONFIG.USERNAME_MIN_LENGTH, maxLength: AUTH_CONFIG.USERNAME_MAX_LENGTH }),
    password: Type.String({ minLength: AUTH_CONFIG.PASSWORD_MIN_LENGTH, maxLength: AUTH_CONFIG.PASSWORD_MAX_LENGTH})
});

export type LoginBodyType = Static<typeof LoginBodySchema>;

export const LoginResponseSchema = Type.Object({
    token: Type.String()
});

export const LoginFailureSchema = Type.Object({
    message: Type.String()
});

export const AuthFailureSchema = Type.Object({
    message: Type.String()
});

