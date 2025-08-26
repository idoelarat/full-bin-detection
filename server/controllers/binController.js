import binModel from "../models/binModel.js";

const binController = {
  getAllBins: (req, res) => {
    console.log("📡 /api/bins route called");

    binModel.getAll((err, results) => {
      if (err) {
        console.error("Controller Error: fetching bins:", err);
        return res.status(500).json({ error: "Failed to retrieve bins" });
      }
      res.json(results);
    });
  },

  getBinById: (req, res) => {
    const { id } = req.params;
    binModel.getById(id, (err, results) => {
      if (err) {
        console.error("Controller Error: fetching bin:", err);
        return res.status(500).json({ error: "Failed to retrieve bin" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json(results[0]);
    });
  },

  deleteBin: (req, res) => {
    const { id } = req.params;
    binModel.delete(id, (err, results) => {
      if (err) {
        console.error("Controller Error: deleting bin:", err);
        return res.status(500).json({ error: "Failed to delete bin" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Bin not found" });
      }
      res.json({ message: "Bin deleted successfully" });
    });
  },

  updateBin: (req, res) => {
    const { id } = req.params;
    const binData = req.body;

    if (!binData.bin_desc) {
      return res.status(400).json({ error: "Bin description is required." });
    }

    binData.bin_id = id;

    binModel.update(binData, (err, result) => {
      if (err) {
        console.error("Controller Error: updating bin:", err);
        return res.status(500).json({ error: "Failed to update bin" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Bin not found or no changes made." });
      }
      res.json({ message: "Bin updated successfully" });
    });
  },

  create: (req, res) => {
    const binData = { ...req.body };

    delete binData.bin_id;

    if (!binData.area_id) {
      return res.status(400).json({ error: "area_id is required." });
    }

    if (
      binData.y !== undefined &&
      binData.y !== null &&
      typeof binData.y !== "number"
    ) {
      return res
        .status(400)
        .json({ error: "y must be a number or null if provided." });
    }

    binModel.create(binData, (err, result) => {
      if (err) {
        console.error("Controller Error: creating bin:", err);
        return res.status(500).json({ error: "Failed to create bin" });
      }

      const newBinId = result && result.insertId ? result.insertId : null;

      if (!newBinId) {
        console.warn("Bin created but no insertId returned by model.");
      }

      res.status(201).json({
        message: "Bin created successfully",
        bin_id: newBinId,
        ...binData,
      });
    });
  },

  deleteBinsByAreaId: (areaId, callback) => {
    binModel.deleteByAreaId(areaId, (err, result) => {
      if (err) {
        console.error("Controller Error: deleting bins by area ID:", err);
      }
      callback(err, result);
    });
  },
};

export default binController;
