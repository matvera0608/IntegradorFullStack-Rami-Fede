import { 
    AllBuffet, 
    obtenerBuffetByID, 
    crearBuffet, 
    actualizarBuffet, 
    eliminarBuffet 
} from "../models/buffet.model.js";

// Obtener todo el catálogo
const getCatalog = async (req, res) => {
    try {
        const catalog = await AllBuffet();
        res.json({ message: "Catálogo completo", catalog });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el catálogo", error: error.message });
    }
};

// Obtener item por ID
const getCatalogByID = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await obtenerBuffetByID(id);

        if (!item) return res.status(404).json({ message: "Item no encontrado" });

        res.json({ message: "Item encontrado", item });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el item", error: error.message });
    }
};

// Crear un nuevo item
const createCatalog = async (req, res) => {
    try {
        const { nombre, descripcion, categoria, disponibilidad, precio } = req.body;
        const insertId = await crearBuffet({ nombre, descripcion, categoria, disponibilidad, precio });

        res.status(201).json({ message: "Item creado con éxito", id: insertId });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el item", error: error.message });
    }
};

// Actualizar un item existente
const updateCatalog = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria, disponibilidad, precio } = req.body;

        const affectedRows = await actualizarBuffet(id, { nombre, descripcion, categoria, disponibilidad, precio });

        if (affectedRows === 0) return res.status(404).json({ message: "Item no encontrado" });

        res.json({ message: "Item actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el item", error: error.message });
    }
};

// Eliminar un item
const deleteCatalog = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await eliminarBuffet(id);

        if (affectedRows === 0) return res.status(404).json({ message: "Item no encontrado" });

        res.json({ message: "Item eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el item", error: error.message });
    }
};
export {
  getCatalog,
  getCatalogByID,
  createCatalog,
  updateCatalog,
  deleteCatalog
};

