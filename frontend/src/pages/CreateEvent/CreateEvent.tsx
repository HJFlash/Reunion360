import React, { useState } from "react";
import "./CreateEvent.css"
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const handleCreateEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const start_time = new Date(`${date}T${time}:00`).toISOString();

    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ topic, start_time, duration: 30 })
      });

      const data = await response.json();
      if (response.ok) {
        setMensaje(`✅ Evento creado. Link: ${data.join_url}`);
        setTopic(""); setDate(""); setTime("");
      } else {
        setMensaje(data.error || "❌ Error al crear evento");
      }
    } catch {
      setMensaje("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="create-event-page">
      <h2>Crear nuevo evento</h2>
      <input type="text" placeholder="Tema" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={handleCreateEvent}>Crear Evento</button>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default CreateEvent;
