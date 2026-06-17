import * as form2gService from "../services/form2gService.js";

export const getForm2G = async (req, res) => {
  try { const result = await form2gService.getAllForm2G(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2GById = async (req, res) => {
  try { const result = await form2gService.getForm2GById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2G not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2G = async (req, res) => {
  try { const result = await form2gService.createForm2G(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2G = async (req, res) => {
  try { const result = await form2gService.updateForm2G(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2G not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2G = async (req, res) => {
  try { const result = await form2gService.deleteForm2G(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2G not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
