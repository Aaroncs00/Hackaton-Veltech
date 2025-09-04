const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear conexión a la base de datos
const dbPath = path.join(__dirname, 'nexa.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    initDatabase();
  }
});

// Inicializar tablas
function initDatabase() {
  // Crear tablas secuencialmente para evitar problemas de sincronización
  db.serialize(() => {
    // Tabla de voluntarios
    db.run(`CREATE TABLE IF NOT EXISTS voluntarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT,
      telefono TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla voluntarios:', err.message);
        return;
      }
      
      // Insertar datos de ejemplo en voluntarios
      db.get("SELECT COUNT(*) as count FROM voluntarios", (err, row) => {
        if (err) {
          console.error('Error contando voluntarios:', err.message);
          return;
        }
        
        if (row.count === 0) {
          const voluntariosEjemplo = [
            ['Juan Pérez', 'juan@email.com', '123456789'],
            ['María García', 'maria@email.com', '987654321'],
            ['Carlos López', 'carlos@email.com', '456123789'],
            ['Ana Martínez', 'ana@email.com', '789456123']
          ];

          const stmt = db.prepare("INSERT INTO voluntarios (nombre, email, telefono) VALUES (?, ?, ?)");
          voluntariosEjemplo.forEach(v => stmt.run(v));
          stmt.finalize((err) => {
            if (err) {
              console.error('Error insertando voluntarios:', err.message);
            } else {
              console.log('Datos de ejemplo de voluntarios insertados');
            }
          });
        }
      });
    });

    // Tabla de donaciones
    db.run(`CREATE TABLE IF NOT EXISTS donaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL CHECK(tipo IN ('economica', 'en_especie')),
      valor REAL DEFAULT 0,
      descripcion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla donaciones:', err.message);
        return;
      }
      
      // Insertar datos de ejemplo en donaciones
      db.get("SELECT COUNT(*) as count FROM donaciones", (err, row) => {
        if (err) {
          console.error('Error contando donaciones:', err.message);
          return;
        }
        
        if (row.count === 0) {
          const donacionesEjemplo = [
            ['economica', 100.50, 'Donación mensual'],
            ['en_especie', 0, 'Ropa y alimentos'],
            ['economica', 250.00, 'Donación corporativa']
          ];

          const stmt = db.prepare("INSERT INTO donaciones (tipo, valor, descripcion) VALUES (?, ?, ?)");
          donacionesEjemplo.forEach(d => stmt.run(d));
          stmt.finalize((err) => {
            if (err) {
              console.error('Error insertando donaciones:', err.message);
            } else {
              console.log('Datos de ejemplo de donaciones insertados');
            }
          });
        }
      });
    });

    // Tabla de turnos
    db.run(`CREATE TABLE IF NOT EXISTS turnos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empleado TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora_inicio TEXT NOT NULL,
      hora_fin TEXT NOT NULL,
      puesto TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creando tabla turnos:', err.message);
      } else {
        console.log('Tabla de turnos creada correctamente');
      }
    });
  });
}

module.exports = db;