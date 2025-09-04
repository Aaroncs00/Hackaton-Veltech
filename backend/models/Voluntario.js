const db = require('../database/database');

class Voluntario {
  static getAll(callback) {
    db.all("SELECT * FROM voluntarios ORDER BY created_at DESC", callback);
  }

  static getById(id, callback) {
    db.get("SELECT * FROM voluntarios WHERE id = ?", [id], callback);
  }

  static create(voluntario, callback) {
    const { nombre, email, telefono } = voluntario;
    db.run(
      "INSERT INTO voluntarios (nombre, email, telefono) VALUES (?, ?, ?)",
      [nombre, email, telefono],
      function(err) {
        callback(err, { id: this.lastID, ...voluntario });
      }
    );
  }

  static update(id, voluntario, callback) {
    const { nombre, email, telefono } = voluntario;
    db.run(
      "UPDATE voluntarios SET nombre = ?, email = ?, telefono = ? WHERE id = ?",
      [nombre, email, telefono, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run("DELETE FROM voluntarios WHERE id = ?", [id], callback);
  }
}

module.exports = Voluntario;