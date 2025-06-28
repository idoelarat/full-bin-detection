import db from "../config/db.js";

const binModel = {
  getAll: (callback) => {
    const sql = "SELECT * FROM bins";
    db.query(sql, callback);
  },

  getById: (binId, callback) => {
    const sql = "SELECT * FROM bins WHERE bin_id = ?";
    db.query(sql, [binId], callback);
  },

  delete: (binId, callback) => {
    const sql = "DELETE FROM bins WHERE bin_id = ?";
    db.query(sql, [binId], callback);
  },

  update: (binData, callback) => {
    const { bin_desc, area_id, bin_id, x, y } = binData;
    const sql = `
      UPDATE bins SET bin_desc = ?, area_id = ?, x = ?, y = ? WHERE bin_id = ?`;
    db.query(sql, [bin_desc, area_id, x, y, bin_id], callback);
  },

  create: (binData, callback) => {
    const { bin_desc, area_id, x, y } = binData;
    const sql = `
      INSERT INTO bins (bin_desc, area_id, x, y)
      VALUES (?, ?, ?, ?)`;
    db.query(sql, [bin_desc, area_id, x, y], callback);
  },
};

export default binModel;
