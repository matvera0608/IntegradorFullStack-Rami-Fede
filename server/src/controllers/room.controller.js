import { 
    AllRooms, 
    obtenerRoomByID, 
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

export {
    getRooms,
    getRoomsByID,
};
