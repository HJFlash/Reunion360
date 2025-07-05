import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalEventos: 0, totalUsuarios: 0, totalAsistencias: 0 });
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState({ name: "" });
  const [myEvents, setMyEvents] = useState([]);

  const navigate = useNavigate();

  const cargarMisEventos = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/events/my-events", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMyEvents(data))
      .catch(err => console.error("Error al obtener mis eventos:", err));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => setUser(user))
      .catch(err => console.error("Error al obtener usuario:", err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    cargarMisEventos();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/events/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStats({
          totalEventos: data.totalEventos,
          totalUsuarios: 0,
          totalAsistencias: data.totalAsistentes,
        });

        const chart = Object.entries(data.eventosPorMes || {}).map(([mes, cantidad]) => ({
          name: mes,
          eventos: cantidad,
        }));

        setChartData(chart);
      })
      .catch(err => console.error("Error al obtener estadísticas:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Control</h1>
      <h2 className="welcome-text">Bienvenido, {user?.name}</h2>

      <button className="go-create-btn" onClick={() => navigate("/crear-evento")}>
        Ir a Crear Evento
      </button>

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
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="name"
              stroke="#ffffff" // eje X blanco
              tick={{ fill: "#ffffff", fontSize: 12 }} // texto del eje
              axisLine={{ stroke: "#ffffff" }} // línea del eje
              tickLine={{ stroke: "#ffffff" }}
            />
            <YAxis
              stroke="#ffffff"
              tick={{ fill: "#ffffff", fontSize: 12 }}
              axisLine={{ stroke: "#ffffff" }}
              tickLine={{ stroke: "#ffffff" }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
              labelStyle={{ color: "#10b981" }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Line
              type="monotone"
              dataKey="eventos"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, stroke: "#ffffff", strokeWidth: 2, fill: "#10b981" }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="my-events">
        <h2>Mis eventos</h2>
        {myEvents.length === 0 ? (
          <p>No has creado eventos todavía.</p>
        ) : (
          <ul>
            {myEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.topic}</strong> <br />
                Fecha: {new Date(event.start_time).toLocaleString()} <br />
                <a href={event.join_url} target="_blank" rel="noopener noreferrer">Enlace</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;