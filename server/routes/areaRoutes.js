// routes/areaRoutes.js
import express from 'express';
import AreaController from '../controllers/areaController.js'; // Import your Area controller

const router = express.Router();

// Get all areas
router.get('/', AreaController.getAllAreas);

// Get a single area by ID
router.get('/:id', AreaController.getAreaById);

// Create a new area
router.post('/', AreaController.createArea);

// Update an existing area
router.put('/:id', AreaController.updateArea);

// Delete an area
router.delete('/:id', AreaController.deleteArea);

export default router;