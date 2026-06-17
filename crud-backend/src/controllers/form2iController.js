import * as form2iService from "../services/form2iService.js";

export const getForm2I = async (req, res) => {
  try { const result = await form2iService.getAllForm2I(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2IById = async (req, res) => {
  try { const result = await form2iService.getForm2IById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2I not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2I = async (req, res) => {
  try { const result = await form2iService.createForm2I(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2I = async (req, res) => {
  try { const result = await form2iService.updateForm2I(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2I not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2I = async (req, res) => {
  try { const result = await form2iService.deleteForm2I(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2I not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
