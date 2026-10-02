import { ActivityLogService } from "../services/implementations/activity-log.implmentation";
import cron from "node-cron";

const activityLogService = new ActivityLogService();

export const initCronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Memulai pembersihan log aktivitas...");
    try {
      await activityLogService.deleteExpiredLogs(14);
    } catch (error) {
      console.error("Gagal membersihkan log:", error);
    }
  });
};
