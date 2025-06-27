import express from 'express';
import binController from '../controllers/binController.js';

const router = express.Router();

// Get all bins
router.get('/', binController.getAllBins);

// Get a single bin by ID
router.get('/:id', binController.getBinById);

// Delete a bin by ID
router.delete('/:id', binController.deleteBin); 

export default router;