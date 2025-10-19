import { 
    AllRooms, 
    obtenerRoomByID, availableRooms,getOcupadasPorTipo, getTotalesPorTipo
} from "../models/room.model.js";

// Obtener todas las habitaciones
const getRooms = async (req, res) => {
    try {
        const rooms = await AllRooms();
        res.json({ rooms });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener habitaciones", error: error.message });
    }
};

// Obtener habitación por ID
const getRoomsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await obtenerRoomByID(id);

        if (!room) return res.status(404).json({ message: "Habitación no encontrada" });

        res.json({ message: "Habitación encontrada", room });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la habitación", error: error.message });
    }
};
const getAvailableRooms = async (req, res)=>{
try {
        const rooms = await availableRooms();
        res.json({ rooms });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener habitaciones", error: error.message });
    }
}


export const getRoomStatus = async (req, res) => {
  try {
    const ocupadas = await getOcupadasPorTipo();
    const totales = await getTotalesPorTipo();

    // Combinar resultados
    const resultado = totales.map(h => {
      const found = ocupadas.find(o => o.idHabitacion === h.idHabitacion);
      const ocupadasCount = found ? found.ocupadas : 0;

      return {
        idHabitacion: h.idHabitacion,
        ocupadas: ocupadasCount,
        disponibles: h.total - ocupadasCount,
        total: h.total
      };
    });

    res.json({ status: resultado });
  } catch (error) {
    console.error('Error al obtener estado de habitaciones:', error);
    res.status(500).json({ message: 'Error interno al obtener estado' });
  }
};

export {
    getRooms,
    getRoomsByID,
getAvailableRooms};
