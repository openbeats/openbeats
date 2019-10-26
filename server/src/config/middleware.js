import cors from 'cors';
import express from 'express';


export default (app) => {
    console.log("configuring middlewares..");
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
} 