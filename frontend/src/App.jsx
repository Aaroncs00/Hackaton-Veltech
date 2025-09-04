import Voluntarios from "./components/Voluntarios";
import Donaciones from "./components/Donaciones";
import Dashboard from "./components/Dashboard";
import Calendar from "./components/Calendar";



export default function App() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Fundación Nexa – Gestión</h1>

      <Dashboard />

      <div className="row g-4 mt-4">
        <div className="col-12"><Voluntarios /></div>
      </div>

      <div className="row g-4 mt-4">
        
      </div>

      <div className="row g-4 mt-4">
        <div className="col-12"><Calendar /></div>
      
      </div>
    </div>
  );
}
