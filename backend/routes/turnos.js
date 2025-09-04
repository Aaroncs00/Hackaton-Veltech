const express = require('express');
const router = express.Router();
const Turno = require('../models/Turno');

// GET todos los turnos
router.get('/', (req, res) => {
  Turno.getAll((err, turnos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(turnos);
  });
});

// GET turnos por fecha
router.get('/fecha/:fecha', (req, res) => {
  const fecha = req.params.fecha;
  Turno.getByDate(fecha, (err, turnos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(turnos);
  });
});

// POST crear nuevo turno
router.post('/', (req, res) => {
  const { empleado, fecha, hora_inicio, hora_fin, puesto } = req.body;
  
  if (!empleado || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  Turno.create({ empleado, fecha, hora_inicio, hora_fin, puesto }, (err, newTurno) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newTurno);
  });
});

// PUT actualizar turno
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { empleado, fecha, hora_inicio, hora_fin, puesto } = req.body;

  if (!empleado || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  Turno.update(id, { empleado, fecha, hora_inicio, hora_fin, puesto }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Turno actualizado correctamente' });
  });
});

// DELETE eliminar turno
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Turno.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Turno eliminado correctamente' });
  });
});

module.exports = router;