// models/areaModel.js
import db from '../config/db.js'; // Import your database connection

const AreaModel = {
  /**
   * Retrieves all areas from the database.
   * @param {function} callback - Callback function (err, results)
   */
  getAll: (callback) => {
    const sql = 'SELECT * FROM areas';
    db.query(sql, callback);
  },

  /**
   * Retrieves a single area by its ID.
   * @param {number} areaId - The ID of the area to retrieve.
   * @param {function} callback - Callback function (err, results)
   */
  getById: (areaId, callback) => {
    const sql = 'SELECT * FROM areas WHERE area_id = ?';
    db.query(sql, [areaId], callback);
  },

  /**
   * Creates a new area in the database.
   * @param {object} areaData - Object containing area_description and img_path.
   * @param {function} callback - Callback function (err, result)
   */
  create: (areaData, callback) => {
    const { area_description, img_path } = areaData;
    const sql = 'INSERT INTO areas (area_description, img_path) VALUES (?, ?)';
    db.query(sql, [area_description, img_path], callback);
  },

  /**
   * Updates an existing area in the database.
   * @param {number} areaId - The ID of the area to update.
   * @param {object} areaData - Object containing updated area_description and img_path.
   * @param {function} callback - Callback function (err, result)
   */
  update: (areaId, areaData, callback) => {
    const { area_description, img_path } = areaData;
    const sql = 'UPDATE areas SET area_description = ?, img_path = ? WHERE area_id = ?';
    db.query(sql, [area_description, img_path, areaId], callback);
  },

  /**
   * Deletes an area from the database.
   * @param {number} areaId - The ID of the area to delete.
   * @param {function} callback - Callback function (err, result)
   */
  delete: (areaId, callback) => {
    const sql = 'DELETE FROM areas WHERE area_id = ?';
    db.query(sql, [areaId], callback);
  }
};

export default AreaModel;