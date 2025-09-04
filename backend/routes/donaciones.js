const express = require('express');
const router = express.Router();
const Donacion = require('../models/Donacion');

// GET todas las donaciones
router.get('/', (req, res) => {
  Donacion.getAll((err, donaciones) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(donaciones);
  });
});

// GET donación por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Donacion.getById(id, (err, donacion) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!donacion) {
      return res.status(404).json({ error: 'Donación no encontrada' });
    }
    res.json(donacion);
  });
});

// POST crear nueva donación
router.post('/', (req, res) => {
  const { tipo, valor, descripcion } = req.body;
  
  if (!tipo || !['economica', 'en_especie'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de donación inválido' });
  }

  Donacion.create({ tipo, valor: valor || 0, descripcion }, (err, newDonacion) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newDonacion);
  });
});

// PUT actualizar donación
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { tipo, valor, descripcion } = req.body;

  if (!tipo || !['economica', 'en_especie'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de donación inválido' });
  }

  Donacion.update(id, { tipo, valor: valor || 0, descripcion }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Donación actualizada correctamente' });
  });
});

// DELETE eliminar donación
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Donacion.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Donación eliminada correctamente' });
  });
});

module.exports = router;