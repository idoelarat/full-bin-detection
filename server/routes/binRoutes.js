import express from 'express';
import binController from '../controllers/binController.js';

const router = express.Router();

// Get all bins
router.get('/', binController.getAllBins);

// Get a single bin by ID
router.get('/:id', binController.getBinById);

// Delete a bin by ID
router.delete('/:id', binController.deleteBin); 

// Update a bin by ID
router.put('/:id', binController.updateBin);    

// Create a new bin
router.post('/', binController.create);

export default router;
