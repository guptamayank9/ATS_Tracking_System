require("dotenv").config();
const mongoose = require("mongoose");
const { Candidate } = require("./models/Candidate");

const people = [
  { name: "Aarav Sharma", email: "aarav@mail.com", role: "Frontend Developer", skills: ["React", "JavaScript", "Tailwind"], experience: 1, path: ["Applied", "Screening", "Interview", "Offer", "Hired"] },
  { name: "Priya Verma", email: "priya@mail.com", role: "Backend Developer", skills: ["Node.js", "MongoDB", "Express"], experience: 2, path: ["Applied", "Screening", "Interview"] },
  { name: "Rohan Gupta", email: "rohan@mail.com", role: "Full Stack Developer", skills: ["React", "Node.js", "SQL"], experience: 1.5, path: ["Applied", "Screening", "Rejected"] },
  { name: "Sneha Patel", email: "sneha@mail.com", role: "Frontend Developer", skills: ["React", "TypeScript"], experience: 3, path: ["Applied", "Screening", "Interview", "Offer"] },
  { name: "Karan Singh", email: "karan@mail.com", role: "Data Analyst", skills: ["Python", "SQL"], experience: 0, path: ["Applied"] },
  { name: "Neha Joshi", email: "neha@mail.com", role: "Backend Developer", skills: ["Java", "Spring", "SQL"], experience: 2, path: ["Applied", "Screening"] },
  { name: "Vikram Rao", email: "vikram@mail.com", role: "Full Stack Developer", skills: ["React", "Node.js", "MongoDB"], experience: 2.5, path: ["Applied", "Screening", "Interview", "Rejected"] },
  { name: "Ananya Das", email: "ananya@mail.com", role: "Frontend Developer", skills: ["React", "CSS"], experience: 0.5, path: ["Applied"] },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Candidate.deleteMany({});

  for (const p of people) {
    const { path, ...data } = p;
    const c = new Candidate({ ...data, stage: path[0] });
    // pre-save hook adds the first history entry, so add the rest here
    path.slice(1).forEach((stage, i) => {
      c.stage = stage;
      c.stageHistory.push({ stage, changedAt: new Date(Date.now() - (path.length - i) * 3600 * 1000) });
    });
    await c.save();
  }

  console.log(`Seeded ${people.length} candidates`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});