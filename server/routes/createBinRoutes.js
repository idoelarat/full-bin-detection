// routes/createBinRoutes.js
import express from 'express';
import createBinController from '../controllers/createBinController.js';

const router = express.Router();

router.post('/', createBinController.create);

export default router;
