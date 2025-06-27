import express from 'express';
import BinController from '../controllers/updateBinController.js';

const router = express.Router();

router.put('/:id', BinController.updateBin);    

export default router;
