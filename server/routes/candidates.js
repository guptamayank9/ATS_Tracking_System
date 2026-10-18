const express = require("express");
const { Candidate, STAGES } = require("../models/Candidate");
const escapeRegex = require("../utils/escapeRegex");

const router = express.Router();

// LIST + SEARCH + FILTER
// /api/candidates?search=rahul&stage=Interview&skill=react&role=frontend
router.get("/", async (req, res) => {
  try {
    const { search, stage, skill, role } = req.query;
    const query = {};

    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: rx }, { email: rx }, { role: rx }, { skills: rx }];
    }
    if (stage) query.stage = stage;
    if (role) query.role = new RegExp(escapeRegex(role), "i");
    if (skill) query.skills = new RegExp(`^${escapeRegex(skill)}$`, "i");

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

// UPDATE (stage yahan se change nahi hoga, uske liye alag route hai)
router.put("/:id", async (req, res) => {
  try {
    const { stage, stageHistory, ...data } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CHANGE STAGE (history save hoti hai)
router.patch("/:id/stage", async (req, res) => {
  try {
    const { stage } = req.body;
    if (!STAGES.includes(stage)) {
      return res.status(400).json({ message: "Invalid stage" });
    }
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    if (candidate.stage !== stage) {
      candidate.stage = stage;
      candidate.stageHistory.push({ stage });
      await candidate.save();
    }
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;