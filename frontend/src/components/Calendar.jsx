import React, { useState } from 'react';

const API = "http://localhost:5000/api/voluntarios";

const EmployeeShiftCalendar = () => {
  // Estado para almacenar los turnos
  const [shifts, setShifts] = useState({});
  // Estado para controlar el formulario de nuevo turno
  const [newShift, setNewShift] = useState({
    employee: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    position: ''
  });
  // Estado para controlar qué día está seleccionado
  const [selectedDate, setSelectedDate] = useState('');
  // Estado para controlar la vista actual (mes, semana, día)
  const [view, setView] = useState('month');
  // Estado para el mes y año actual
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Lista de empleados de ejemplo
  const employees = [
    { id: 1, name: 'Juan Pérez'},
    { id: 2, name: 'María García'},
    { id: 3, name: 'Carlos López'},
    { id: 4, name: 'Ana Martínez'}
  ];

  // Función para manejar el envío del formulario de nuevo turno
  const handleAddShift = (e) => {
    e.preventDefault();
    if (!newShift.employee || !newShift.date) return;
    
    const shiftId = Date.now();
    const updatedShifts = { ...shifts };
    
    if (!updatedShifts[newShift.date]) {
      updatedShifts[newShift.date] = [];
    }
    
    updatedShifts[newShift.date].push({
      id: shiftId,
      ...newShift
    });
    
    setShifts(updatedShifts);
    setNewShift({
      employee: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '17:00',
      position: ''
    });
  };

  // Función para eliminar un turno
  const handleDeleteShift = (date, id) => {
    const updatedShifts = { ...shifts };
    updatedShifts[date] = updatedShifts[date].filter(shift => shift.id !== id);
    setShifts(updatedShifts);
  };

  // Función para generar los días del mes
  const generateMonthDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 (domingo) a 6 (sábado)
    
    const days = [];
    
    // Días del mes anterior (para completar la primera semana)
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthLastDay - startingDay + i + 1),
        isCurrentMonth: false
      });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }
    
    // Días del próximo mes (para completar la última semana)
    const totalCells = 42; // 6 semanas * 7 días
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Función para cambiar de mes
  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Obtener los días del mes
  const monthDays = generateMonthDays();

  // Formatear fecha para mostrarla
  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-4 d-flex">
      <div className="row flex-grow-1">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Calendario de Turnos</h2>
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${view === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('month')}
              >
                Mes
              </button>
              <button 
                type="button" 
                className={`btn ${view === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('week')}
              >
                Semana
              </button>
              <button 
                type="button" 
                className={`btn ${view === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('day')}
              >
                Día
              </button>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => changeMonth('prev')}
                >
                  &lt; Mes anterior
                </button>
                <h4 className="mb-0 text-center">
                  {new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h4>
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => changeMonth('next')}
                >
                  Mes siguiente &gt;
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <th key={day} className="text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(6)].map((_, weekIndex) => (
                      <tr key={weekIndex}>
                        {monthDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                          const dateStr = day.date.toISOString().split('T')[0];
                          const dayShifts = shifts[dateStr] || [];
                          const isToday = new Date().toDateString() === day.date.toDateString();
                          
                          return (
                            <td 
                              key={dayIndex} 
                              className={`calendar-day ${!day.isCurrentMonth ? 'bg-light text-muted' : ''} ${dateStr === selectedDate ? 'table-primary' : ''} ${isToday ? 'border border-primary' : ''}`}
                              style={{ height: '120px', verticalAlign: 'top', cursor: 'pointer' }}
                              onClick={() => setSelectedDate(dateStr)}
                            >
                              <div className="d-flex justify-content-between">
                                <span className={isToday ? 'badge bg-primary rounded-circle p-1' : ''}>
                                  {day.date.getDate()}
                                </span>
                                {dayShifts.length > 0 && (
                                  <span className="badge bg-info">{dayShifts.length}</span>
                                )}
                              </div>
                              <div className="mt-2">
                                {dayShifts.slice(0, 2).map(shift => (
                                  <div key={shift.id} className="badge bg-success mb-1 text-truncate" style={{ fontSize: '0.7rem', maxWidth: '100%' }}>
                                    {shift.employee.split(' ')[0]}
                                  </div>
                                ))}
                                {dayShifts.length > 2 && (
                                  <div className="badge bg-secondary">+{dayShifts.length - 2} más</div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row d-flex flex-column ps-4">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Gestión de Turnos</h5>
            </div>
            <div className="card-body">
              {selectedDate ? (
                <>
                  <h6 className="card-subtitle mb-3 text-muted">
                    Turnos para el {formatDate(new Date(selectedDate))}
                  </h6>
                  
                  <div className="mb-4">
                    <h6>Turnos programados:</h6>
                    {shifts[selectedDate] && shifts[selectedDate].length > 0 ? (
                      <div className="list-group">
                        {shifts[selectedDate].map(shift => (
                          <div key={shift.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{shift.employee}</strong>
                              <div className="text-muted small">
                                {shift.startTime} - {shift.endTime} | {shift.position}
                              </div>
                            </div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteShift(selectedDate, shift.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info mb-0">No hay turnos programados para este día.</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="alert alert-warning">Selecciona una fecha en el calendario para gestionar turnos.</div>
              )}
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Añadir nuevo turno</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddShift}>
                <div className="mb-3">
                  <label htmlFor="employee" className="form-label">Empleado</label>
                  <select 
                    className="form-select"
                    id="employee"
                    value={newShift.employee} 
                    onChange={(e) => setNewShift({...newShift, employee: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Fecha</label>
                  <input 
                    type="date" 
                    className="form-control"
                    id="date"
                    value={newShift.date || selectedDate || new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                    required
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startTime" className="form-label">Hora inicio</label>
                    <input 
                      type="time" 
                      className="form-control"
                      id="startTime"
                      value={newShift.startTime} 
                      onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endTime" className="form-label">Hora fin</label>
                    <input 
                      type="time" 
                      className="form-control"
                      id="endTime"
                      value={newShift.endTime} 
                      onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="position" className="form-label">Puesto</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="position"
                    value={newShift.position} 
                    onChange={(e) => setNewShift({...newShift, position: e.target.value})}
                    placeholder="Ej: Cajero, Reponedor..."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Añadir Turno</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeShiftCalendar;