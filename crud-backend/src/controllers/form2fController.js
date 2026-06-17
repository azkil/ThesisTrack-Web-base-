import * as form2fService from "../services/form2fService.js";

export const getForm2F = async (req, res) => {
  try { const result = await form2fService.getAllForm2F(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2FById = async (req, res) => {
  try { const result = await form2fService.getForm2FById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2F not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2F = async (req, res) => {
  try { const result = await form2fService.createForm2F(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2F = async (req, res) => {
  try { const result = await form2fService.updateForm2F(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2F not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2F = async (req, res) => {
  try { const result = await form2fService.deleteForm2F(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2F not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
