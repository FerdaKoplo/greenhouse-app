import { z } from "zod";

export const ActivityLogSchema = z.object({
  id: z.number().int().positive(),
  timestamp: z.coerce.date(),
  category: z.string().min(1, "Kategori tidak boleh kosong"),
  activity: z.string().min(1, "Deskripsi aktivitas tidak boleh kosong"),
  status: z.string().min(1, "Status tidak boleh kosong"),
});

export const CreateActivityLogSchema = ActivityLogSchema.omit({
  id: true,
  timestamp: true,
});

export const UpdateActivityLogSchema = ActivityLogSchema.partial();

export type ActivityLogDto = z.infer<typeof ActivityLogSchema>;
export type CreateActivityLogDto = z.infer<typeof CreateActivityLogSchema>;
export type UpdateActivityLogDto = z.infer<typeof UpdateActivityLogSchema>;
