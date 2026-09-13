import { z } from "zod";

export const PLCSettingSchema = z.object({
  id: z.number().int().positive(),
  ipAddress: z.ipv4("Format IP Address tidak valid"),
  heartbeatInterval: z
    .number()
    .int()
    .positive("Interval heartbeat harus lebih dari 0"),
});

export const CreatePLCSettingSchema = PLCSettingSchema.omit({
  id: true,
});

export const UpdatePLCSettingSchema = PLCSettingSchema.partial();

export type PLCSettingDto = z.infer<typeof PLCSettingSchema>;
export type CreatePLCSettingDto = z.infer<typeof CreatePLCSettingSchema>;
export type UpdatePLCSettingDto = z.infer<typeof UpdatePLCSettingSchema>;
