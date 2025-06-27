import binModel from "../models/binModel.js";

const binController = {

    // Get all bins
    getAllBins: (req, res) => {
        console.log("📡 /api/bins route called");

        binModel.getAll((err, results) => {
            if (err) {
                console.error('Controller Error: fetching bins:', err);
                return res.status(500).json({ error: 'Failed to retrieve bins' });
            }
            res.json(results);
        });
    },

    // Get a single bin by ID
    getBinById: (req, res) => {
        const { id } = req.params;
        binModel.getById(id, (err, results) => {
            if (err) {
                console.error('Controller Error: fetching bin:', err);
                return res.status(500).json({ error: 'Failed to retrieve bin' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Bin not found' });
            }
            res.json(results[0]);
        });
    },

    // Delete a bin by ID
    deleteBin: (req, res) => {
        const { id } = req.params;
        binModel.delete(id, (err, results) => {
            if (err) {
                console.error('Controller Error: deleting bin:', err);
                return res.status(500).json({ error: 'Failed to delete bin' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Bin not found' });
            }
            res.json({ message: 'Bin deleted successfully' });
        });
    }

};

export default binController;