import express from 'express'
import dotenv from 'dotenv';
import { initDatabase } from './database.js'


// ROUTES
import orderRoutes from './server/routes/orderRoutes.js';
import productRoutes from './server/routes/productRoutes.js'

dotenv.config(); // INIT .env
initDatabase(); // INIT DB

const expressApp = express();
const port = 3000;

//MIDDLEWARE
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.use(express.static("public"));

expressApp.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
});

// USE ROUTES
expressApp.use('/api', orderRoutes);
expressApp.use('/api', productRoutes);