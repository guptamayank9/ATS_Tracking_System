const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidates');
const { protect } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");


app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) =>{
   res.json({
    ok:true
   })
});



app.use("/api/auth", authRoutes);
app.use("/api/candidates", protect, candidateRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

const PORT = process.env.PORT || 5000


connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on ${PORT}`));
});