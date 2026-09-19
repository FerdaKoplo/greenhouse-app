import express from "express";
import auth from "./routers/auth.route";

import zones from "./routers/irrigation.route";
import telemetery from "./routers/plcTelemetry.route";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "Success",
    message: "Express Backend is successfully connected!",
  });
});

app.use("/api/auth", auth);

app.use("/api/irrigation", zones);

app.listen(PORT, () => {
  console.log(`api:dev: Backend API running on http://localhost:${PORT}`);
});
