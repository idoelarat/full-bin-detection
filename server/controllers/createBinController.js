import createBinModel from '../models/createBinModel.js';

const createBinController = {
  create: (req, res) => {
    const binData = req.body;

    if (!binData.bin_id || !binData.area_id) {
      return res.status(400).json({ error: 'bin_id and area_id are required.' });
    }

    if (
      binData.x !== undefined &&
      binData.x !== null &&
      typeof binData.x !== 'number'
    ) {
      return res.status(400).json({ error: 'x must be a number or null.' });
    }

    if (
      binData.y !== undefined &&
      binData.y !== null &&
      typeof binData.y !== 'number'
    ) {
      return res.status(400).json({ error: 'y must be a number or null.' });
    }

    createBinModel.create(binData, (err, result) => {
      if (err) {
        console.error('Controller Error: creating bin:', err);
        return res.status(500).json({ error: 'Failed to create bin' });
      }

      res.status(201).json({
        message: 'Bin created successfully',
        bin_id: binData.bin_id,
        ...binData
      });
    });
  }
};

export default createBinController;
