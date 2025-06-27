import BinModel from '../models/updateBinModel.js';

const BinController = {
 updateBin: (req, res) => {
    const { id } = req.params;
    const binData = req.body;

    if (!binData.bin_desc) {
      return res.status(400).json({ error: 'Bin description is required.' });
    }

    binData.bin_id = id;

    BinModel.update(binData, (err, result) => {
      if (err) {
        console.error('Controller Error: updating bin:', err);
        return res.status(500).json({ error: 'Failed to update bin' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bin not found or no changes made.' });
      }
      res.json({ message: 'Bin updated successfully' });
    });
  },
}
export default BinController;