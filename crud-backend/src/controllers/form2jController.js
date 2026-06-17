import * as form2jService from "../services/form2jService.js";

export const getForm2J = async (req, res) => {
  try { const result = await form2jService.getAllForm2J(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2JById = async (req, res) => {
  try { const result = await form2jService.getForm2JById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2J not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2J = async (req, res) => {
  try { const result = await form2jService.createForm2J(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2J = async (req, res) => {
  try { const result = await form2jService.updateForm2J(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2J not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2J = async (req, res) => {
  try { const result = await form2jService.deleteForm2J(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2J not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
