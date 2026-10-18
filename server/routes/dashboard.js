const express = require("express");
const { Candidate, STAGES } = require("../models/Candidate");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = await Candidate.countDocuments();

    // 1. Abhi kis stage me kitne candidates hain
    const grouped = await Candidate.aggregate([
      { $group: { _id: "$stage", count: { $sum: 1 } } },
    ]);
    const byStage = Object.fromEntries(STAGES.map((s) => [s, 0]));
    grouped.forEach((g) => (byStage[g._id] = g.count));

    // 2. Funnel: kitne candidates kabhi bhi us stage tak pahunche
    const funnelStages = ["Applied", "Screening", "Interview", "Offer", "Hired"];
    const funnel = await Promise.all(
      funnelStages.map(async (stage) => ({
        stage,
        count: await Candidate.countDocuments({ "stageHistory.stage": stage }),
      }))
    );
    const funnelWithRate = funnel.map((f, i) => ({
      ...f,
      conversion:
        i === 0 || funnel[i - 1].count === 0
          ? 100
          : Math.round((f.count / funnel[i - 1].count) * 100),
    }));

    // 3. Recent activity: last 10 stage changes
    const recentActivity = await Candidate.aggregate([
      { $unwind: "$stageHistory" },
      { $sort: { "stageHistory.changedAt": -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          candidateId: "$_id",
          name: 1,
          role: 1,
          stage: "$stageHistory.stage",
          changedAt: "$stageHistory.changedAt",
        },
      },
    ]);

    res.json({ total, byStage, funnel: funnelWithRate, recentActivity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;