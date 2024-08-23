/* import mysql from 'mysql2/promise'

// Configura la conexión a la base de datos
const connection = mysql.createPool({
  host: 'viaduct.proxy.rlwy.net',   
  port: 27232,   
  user: 'root',           
  password: 'kExpvQRLAnigUHjdEvNouHCWAVDtwGQS',    
  database: 'railway',  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default connection  */ 

import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection  = mysql.createPool({
  host: 'localhost',   
  user: 'root',           
  password: 'root',  
  database: 'admineventos', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default connection   

