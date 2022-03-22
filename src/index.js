import express, { json } from 'express';
import cors from 'cors';
import router from './routes/index.js';

express().use(cors());
express().use(json());

express().use(router);

express().listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
});
