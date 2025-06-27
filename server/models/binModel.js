import db from '../config/db.js';

const binModel = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM bins';
        db.query(sql, callback);
      },
    
      getById: (binId, callback) => {
        const sql = 'SELECT * FROM bins WHERE bin_id = ?';
        db.query(sql, [binId], callback);
      },

      delete: (binId, callback) => {
        const sql = 'DELETE FROM bins WHERE bin_id = ?';
        db.query(sql, [binId], callback);
    }
  };
  
  export default binModel;