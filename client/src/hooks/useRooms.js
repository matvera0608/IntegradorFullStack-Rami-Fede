import { useState, useEffect } from 'react';

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservasActivas, setReservasActivas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener habitaciones
        const responseRooms = await fetch('http://localhost:8080/api/room/rooms');
        if (!responseRooms.ok) throw new Error('Error al obtener habitaciones');
        const dataRooms = await responseRooms.json();
        
        // Transformar habitaciones según tu estructura de BD
        const transformedRooms = dataRooms.rooms.map(room => ({
          id: room.id,
          type: room.type,
          image: room.image,
          description: room.description,
          available: room.available,
          features: room.features.split(', ').map(feature => feature.trim())
        }));
        
        setRooms(transformedRooms);

        // 2. Obtener reservas activas (cuando crees el endpoint)
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Content-Type': 'application/json'
          };
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const responseReservas = await fetch('http://localhost:8080/api/reservations/active', {
            method: 'GET',
            headers
          });

          if (responseReservas.ok) {
            const dataReservas = await responseReservas.json();
            // Esperamos que el endpoint devuelva: { reservas: [...] }
            setReservasActivas(dataReservas.reservas || dataReservas || []);
          } else {
            // Si el endpoint no existe aún, no hay problema
            console.warn('Endpoint de reservas activas no disponible aún');
            setReservasActivas([]);
          }
        } catch (error) {
          console.warn('No se pudieron obtener las reservas activas:', error);
          setReservasActivas([]);
        }
        
      } catch (err) {
        console.error('Error en useRooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    rooms, 
    loading, 
    error,
    reservasActivas
  };
};

export const useRoomStatus = () => {
  const [roomsStatus, setRoomsStatus] = useState([]);
  const [reservasActivas, setReservasActivas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // 🔹 1. Obtener habitaciones
        const resRooms = await fetch('http://localhost:8080/api/room/rooms');
        if (!resRooms.ok) throw new Error('Error al obtener habitaciones');
        const dataRooms = await resRooms.json();

        // 🔹 2. Obtener estado de ocupación
        const resStatus = await fetch('http://localhost:8080/api/room/status');
        if (!resStatus.ok) throw new Error('Error al obtener estado de habitaciones');
        const dataStatus = await resStatus.json();

        // Crear un mapa por idHabitacion para unir los datos
        const statusMap = new Map(dataStatus.status.map(s => [s.idHabitacion, s]));

        // 🔹 3. Combinar habitaciones + estado
        const combinedRooms = dataRooms.rooms.map(room => {
          const estado = statusMap.get(room.id) || {
            ocupadas: 0,
            disponibles: room.available,
            total: room.available
          };

          return {
            id: room.id,
            type: room.type,
            image: room.image,
            description: room.description,
            features: room.features.split(', ').map(f => f.trim()),
            total: estado.total,
            ocupadas: estado.ocupadas,
            disponibles: estado.disponibles,
            isFull: estado.disponibles <= 0 // 🔴 true si está lleno
          };
        });

        setRoomsStatus(combinedRooms);

        // 🔹 4. Obtener reservas activas
        try {
          const token = localStorage.getItem('token');
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const resReservas = await fetch('http://localhost:8080/api/reservations/active', { headers });
          if (resReservas.ok) {
            const dataReservas = await resReservas.json();
            setReservasActivas(dataReservas.reservas || []);
          } else {
            console.warn('No se pudieron obtener reservas activas');
            setReservasActivas([]);
          }
        } catch (err) {
          console.warn('Error obteniendo reservas activas:', err);
          setReservasActivas([]);
        }

      } catch (err) {
        console.error('Error en useRoomStatus:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, []);

  return { roomsStatus, reservasActivas, loading, error };
};
