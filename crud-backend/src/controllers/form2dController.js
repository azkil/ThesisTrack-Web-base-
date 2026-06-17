import * as form2dService from "../services/form2dService.js";

export const getForm2D = async (req, res) => {
  try { const result = await form2dService.getAllForm2D(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2DById = async (req, res) => {
  try { const result = await form2dService.getForm2DById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2D not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2D = async (req, res) => {
  try { const result = await form2dService.createForm2D(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2D = async (req, res) => {
  try { const result = await form2dService.updateForm2D(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2D not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2D = async (req, res) => {
  try { const result = await form2dService.deleteForm2D(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2D not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2DStatus = async (req, res) => {
  try { const { status } = req.body;
        const result = await form2dService.updateForm2DStatus(req.params.id, status);
        if (!result) return res.status(404).json({ message: "Form 2D not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
