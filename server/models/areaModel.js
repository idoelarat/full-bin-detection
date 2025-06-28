// models/areaModel.js
import db from '../config/db.js'; // Import your database connection

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
    const { area_description, img_path } = areaData;
    const sql = 'INSERT INTO areas (area_description, img_path) VALUES (?, ?)';
    db.query(sql, [area_description, img_path], callback);
  },

  update: (areaId, areaData, callback) => {
    const { area_description, img_path } = areaData;
    const sql = 'UPDATE areas SET area_description = ?, img_path = ? WHERE area_id = ?';
    db.query(sql, [area_description, img_path, areaId], callback);
  },

  delete: (areaId, callback) => {
    const sql = 'DELETE FROM areas WHERE area_id = ?';
    db.query(sql, [areaId], callback);
  }
};

export default AreaModel;