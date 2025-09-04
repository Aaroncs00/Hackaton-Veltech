const express = require('express');
const router = express.Router();
const Voluntario = require('../models/Voluntario');

// GET todos los voluntarios
router.get('/', (req, res) => {
  Voluntario.getAll((err, voluntarios) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(voluntarios);
  });
});

// GET voluntario por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  Voluntario.getById(id, (err, voluntario) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!voluntario) {
      return res.status(404).json({ error: 'Voluntario no encontrado' });
    }
    res.json(voluntario);
  });
});

// POST crear nuevo voluntario
router.post('/', (req, res) => {
  const { nombre, email, telefono } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  Voluntario.create({ nombre, email, telefono }, (err, newVoluntario) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(newVoluntario);
  });
});

// PUT actualizar voluntario
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, email, telefono } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  Voluntario.update(id, { nombre, email, telefono }, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Voluntario actualizado correctamente' });
  });
});

// DELETE eliminar voluntario
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Voluntario.delete(id, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Voluntario eliminado correctamente' });
  });
});

module.exports = router;