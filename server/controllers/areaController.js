// controllers/areaController.js
import AreaModel from '../models/areaModel.js'; // Import your Area model

const AreaController = {
  // Get all areas
  getAllAreas: (req, res) => {
    AreaModel.getAll((err, results) => {
      if (err) {
        console.error('Controller Error: fetching areas:', err);
        return res.status(500).json({ error: 'Failed to retrieve areas' });
      }
      res.json(results);
    });
  },

  // Get a single area by ID
  getAreaById: (req, res) => {
    const { id } = req.params;
    AreaModel.getById(id, (err, results) => {
      if (err) {
        console.error('Controller Error: fetching area:', err);
        return res.status(500).json({ error: 'Failed to retrieve area' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Area not found' });
      }
      res.json(results[0]);
    });
  },

  // Create a new area
  createArea: (req, res) => {
    const areaData = req.body;

    // Basic validation (can be expanded)
    if (!areaData.area_description) {
      return res.status(400).json({ error: 'Area description is required.' });
    }

    AreaModel.create(areaData, (err, result) => {
      if (err) {
        console.error('Controller Error: creating area:', err);
        return res.status(500).json({ error: 'Failed to create area' });
      }
      res.status(201).json({
        message: 'Area created successfully',
        area_id: result.insertId,
        ...areaData
      });
    });
  },

  // Update an existing area
  updateArea: (req, res) => {
    const { id } = req.params;
    const areaData = req.body;

    if (!areaData.area_description) {
      return res.status(400).json({ error: 'Area description is required.' });
    }

    AreaModel.update(id, areaData, (err, result) => {
      if (err) {
        console.error('Controller Error: updating area:', err);
        return res.status(500).json({ error: 'Failed to update area' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Area not found or no changes made.' });
      }
      res.json({ message: 'Area updated successfully' });
    });
  },

  // Delete an area
  deleteArea: (req, res) => {
    const { id } = req.params;
    AreaModel.delete(id, (err, result) => {
      if (err) {
        console.error('Controller Error: deleting area:', err);
        return res.status(500).json({ error: 'Failed to delete area' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Area not found.' });
      }
      res.json({ message: 'Area deleted successfully' });
    });
  }
};

export default AreaController;