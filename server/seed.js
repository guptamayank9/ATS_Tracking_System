require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({ email: "admin@ats.com" });
  await User.create({ email: "admin@ats.com", password: "admin123", name: "Admin" });
  console.log("Seeded: admin@ats.com / admin123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});