import * as form2hService from "../services/form2hService.js";

export const getForm2H = async (req, res) => {
  try { const result = await form2hService.getAllForm2H(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2HById = async (req, res) => {
  try { const result = await form2hService.getForm2HById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2H not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2H = async (req, res) => {
  try { const result = await form2hService.createForm2H(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2H = async (req, res) => {
  try { const result = await form2hService.updateForm2H(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2H not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2H = async (req, res) => {
  try { const result = await form2hService.deleteForm2H(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2H not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
