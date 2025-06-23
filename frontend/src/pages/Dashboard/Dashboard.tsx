import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css"; // Este es tu CSS personalizado

const data = [
  { name: "Ene", eventos: 4 },
  { name: "Feb", eventos: 7 },
  { name: "Mar", eventos: 5 },
  { name: "Abr", eventos: 10 },
  { name: "May", eventos: 8 },
  { name: "Jun", eventos: 12 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEventos: 0,
    totalUsuarios: 0,
    totalAsistencias: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalEventos: 32,
        totalUsuarios: 120,
        totalAsistencias: 293,
      });
    }, 1000);
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Control</h1>

      <div className="dashboard-cards">
        <div className="card blue">
          <p>Eventos creados</p>
          <h2>{stats.totalEventos}</h2>
        </div>
        <div className="card green">
          <p>Usuarios registrados</p>
          <h2>{stats.totalUsuarios}</h2>
        </div>
        <div className="card purple">
          <p>Asistencias confirmadas</p>
          <h2>{stats.totalAsistencias}</h2>
        </div>
      </div>

      <div className="chart-section">
        <h2>Eventos por mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="eventos" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
