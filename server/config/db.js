//config/db.js
import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'full_bin_project'
});

connection.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL');
});

export default connection;
