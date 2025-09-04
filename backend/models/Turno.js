const db = require('../database/database');

class Turno {
  static getAll(callback) {
    db.all("SELECT * FROM turnos ORDER BY fecha, hora_inicio", callback);
  }

  static getByDate(fecha, callback) {
    db.all("SELECT * FROM turnos WHERE fecha = ? ORDER BY hora_inicio", [fecha], callback);
  }

  static create(turno, callback) {
    const { empleado, fecha, hora_inicio, hora_fin, puesto } = turno;
    db.run(
      "INSERT INTO turnos (empleado, fecha, hora_inicio, hora_fin, puesto) VALUES (?, ?, ?, ?, ?)",
      [empleado, fecha, hora_inicio, hora_fin, puesto],
      function(err) {
        callback(err, { id: this.lastID, ...turno });
      }
    );
  }

  static update(id, turno, callback) {
    const { empleado, fecha, hora_inicio, hora_fin, puesto } = turno;
    db.run(
      "UPDATE turnos SET empleado = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, puesto = ? WHERE id = ?",
      [empleado, fecha, hora_inicio, hora_fin, puesto, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run("DELETE FROM turnos WHERE id = ?", [id], callback);
  }
}

module.exports = Turno;