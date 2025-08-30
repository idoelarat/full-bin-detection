// controllers/areaController.js
import AreaModel from "../models/areaModel.js";
import binController from "./binController.js";

const AreaController = {
  getAllAreas: (req, res) => {
    AreaModel.getAll((err, results) => {
      if (err) {
        console.error("Controller Error: fetching areas:", err);
        return res.status(500).json({ error: "Failed to retrieve areas" });
      }
      res.json(results);
    });
  },

  getAreaById: (req, res) => {
    const { id } = req.params;
    AreaModel.getById(id, (err, results) => {
      if (err) {
        console.error("Controller Error: fetching area:", err);
        return res.status(500).json({ error: "Failed to retrieve area" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Area not found" });
      }
      res.json(results[0]);
    });
  },

  createArea: (req, res) => {
    const areaData = req.body;

    if (!areaData.area_name) {
      return res.status(400).json({ error: "Area name is required." });
    }
    if (!areaData.area_description) {
      return res.status(400).json({ error: "Area description is required." });
    }

    AreaModel.create(areaData, (err, result) => {
      if (err) {
        console.error("Controller Error: creating area:", err);
        
        // Check if the error is a duplicate entry (MySQL code ER_DUP_ENTRY)
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "Area name already exists." });
        }

        return res.status(500).json({ error: "Failed to create area" });
      }
      res.status(201).json({
        message: "Area created successfully",
        area_id: result.insertId,
        ...areaData,
      });
    });
  },

  updateArea: (req, res) => {
    const { id } = req.params;
    const areaData = req.body;

    if (!areaData.area_name) {
      return res.status(400).json({ error: "Area name is required." });
    }
    if (!areaData.area_description) {
      return res.status(400).json({ error: "Area description is required." });
    }

    AreaModel.update(id, areaData, (err, result) => {
      if (err) {
        console.error("Controller Error: updating area:", err);
        return res.status(500).json({ error: "Failed to update area" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Area not found or no changes made." });
      }
      res.json({ message: "Area updated successfully" });
    });
  },

  deleteArea: (req, res) => {
    const { id } = req.params;

    binController.deleteBinsByAreaId(id, (err, binResult) => {
      if (err) {
        console.error(
          "Controller Error: deleting bins associated with area:",
          err
        );
        return res
          .status(500)
          .json({ error: "Failed to delete bins for the area." });
      }

      AreaModel.delete(id, (err, areaResult) => {
        if (err) {
          console.error("Controller Error: deleting area:", err);
          return res.status(500).json({ error: "Failed to delete area" });
        }
        if (areaResult.affectedRows === 0) {
          return res.status(404).json({ message: "Area not found." });
        }
        res
          .status(200)
          .json({
            message: "Area and all associated bins deleted successfully",
          });
      });
    });
  },
};

export default AreaController;