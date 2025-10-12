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