// models/areaModel.js
import db from '../config/db.js';

const AreaModel = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM areas';
    db.query(sql, callback);
  },

  getById: (areaId, callback) => {
    const sql = 'SELECT * FROM areas WHERE area_id = ?';
    db.query(sql, [areaId], callback);
  },

  create: (areaData, callback) => {
    // Correctly destructure the new area_name field
    const { area_name, area_description, img_path } = areaData;
    // Update the SQL INSERT statement to include area_name
    const sql = 'INSERT INTO areas (area_name, area_description, img_path) VALUES (?, ?, ?)';
    // Pass the new field in the values array
    db.query(sql, [area_name, area_description, img_path], callback);
  },

  update: (areaId, areaData, callback) => {
    // Correctly destructure the new area_name field
    const { area_name, area_description, img_path } = areaData;
    // Update the SQL UPDATE statement to include area_name
    const sql = 'UPDATE areas SET area_name = ?, area_description = ?, img_path = ? WHERE area_id = ?';
    // Pass the new field in the values array
    db.query(sql, [area_name, area_description, img_path, areaId], callback);
  },

  delete: (areaId, callback) => {
    const sql = 'DELETE FROM areas WHERE area_id = ?';
    db.query(sql, [areaId], callback);
  }
};

export default AreaModel;
