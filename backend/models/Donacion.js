const db = require('../database/database');

class Donacion {
  static getAll(callback) {
    db.all("SELECT * FROM donaciones ORDER BY created_at DESC", callback);
  }

  static getById(id, callback) {
    db.get("SELECT * FROM donaciones WHERE id = ?", [id], callback);
  }

  static create(donacion, callback) {
    const { tipo, valor, descripcion } = donacion;
    db.run(
      "INSERT INTO donaciones (tipo, valor, descripcion) VALUES (?, ?, ?)",
      [tipo, valor, descripcion],
      function(err) {
        callback(err, { id: this.lastID, ...donacion });
      }
    );
  }

  static update(id, donacion, callback) {
    const { tipo, valor, descripcion } = donacion;
    db.run(
      "UPDATE donaciones SET tipo = ?, valor = ?, descripcion = ? WHERE id = ?",
      [tipo, valor, descripcion, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run("DELETE FROM donaciones WHERE id = ?", [id], callback);
  }
}

module.exports = Donacion;