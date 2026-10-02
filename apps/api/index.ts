import express from "express";
import auth from "./routers/auth.route";
import zones from "./routers/irrigation.route";
import fertigations from "./routers/fertigation.route";
import valveControl from "./routers/valve-control.route";

import cors from "cors";
import { requireAuth } from "./middleware/auth.middleware";
import { initCronJobs } from "./jobs/activity-log-expiration.job";

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
app.use("/api/irrigation", requireAuth, zones);
app.use("/api/fertigation", requireAuth, fertigations);
app.use("/api/valve-control", requireAuth, valveControl);

app.listen(PORT, () => {
  console.log(`api:dev: Backend API running on http://localhost:${PORT}`);
  initCronJobs();
});
