import db from '../config/db.js'; 
const createBinModel = {
  create: (binData, callback) => {
    const { bin_id, bin_desc, x, y, area_id } = binData;

    const sql = `
      INSERT INTO bins (bin_id, bin_desc, x, y, area_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [bin_id, bin_desc, x, y, area_id], callback);
  }
};

export default createBinModel;
