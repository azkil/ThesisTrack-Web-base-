import * as form2eService from "../services/form2eService.js";

export const getForm2E = async (req, res) => {
  try { const result = await form2eService.getAllForm2E(); res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const getForm2EById = async (req, res) => {
  try { const result = await form2eService.getForm2EById(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2E not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const createForm2E = async (req, res) => {
  try { const result = await form2eService.createForm2E(req.body); res.status(201).json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateForm2E = async (req, res) => {
  try { const result = await form2eService.updateForm2E(req.params.id, req.body);
        if (!result) return res.status(404).json({ message: "Form 2E not found" });
        res.json(result); }
  catch (error) { res.status(500).json({ error: error.message }); }
};

export const deleteForm2E = async (req, res) => {
  try { const result = await form2eService.deleteForm2E(req.params.id);
        if (!result) return res.status(404).json({ message: "Form 2E not found" });
        res.json({ message: "Deleted successfully", deleted: result }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
