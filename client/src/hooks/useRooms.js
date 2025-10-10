import { useState, useEffect } from 'react';

const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/room/rooms');
        if (!response.ok) throw new Error('Error al obtener habitaciones');
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Transformar los datos al formato correcto
        const transformedRooms = data.rooms.map(room => ({
          id: room.id,
          type: room.type,
          image: room.image,
          description: room.description,
          available: room.available,
          // Convertir el string de features en array
          features: room.features.split(', ').map(feature => feature.trim())
        }));
        
        console.log('Habitaciones transformadas:', transformedRooms);
        setRooms(transformedRooms);
      } catch (err) {
        console.error('Error en useRooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { rooms, loading, error };
};

export default useRooms;