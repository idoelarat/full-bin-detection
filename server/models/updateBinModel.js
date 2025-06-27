import db from '../config/db.js'; // Import your database connection


const UpdatebinModel = {
  update: (binData, callback) => {
    const { bin_desc, area_id, bin_id, x, y } = binData;
    const sql = `
      UPDATE bins SET bin_desc = ?, area_id = ?, x = ?, y = ? WHERE bin_id = ?`;
    db.query(sql, [bin_desc, area_id, x, y, bin_id], callback);
  }
};

export default UpdatebinModel;
