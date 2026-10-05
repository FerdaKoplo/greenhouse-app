import { z } from "zod";

export const PlcTelemetrySchema = z.object({
  id: z.number().int().positive(),
  timestamp: z.coerce.date(),
  outEc: z.number().nonnegative(),
  outKadarAir: z.number().nonnegative(),
  outKelembaban: z.number().nonnegative(),
  outPh: z.number().nonnegative(),
  outSuhu: z.number(),
  outNitrogen: z.number().nonnegative(),
  outPhospor: z.number().nonnegative(),
  outKalium: z.number().nonnegative(),
  inJamAir: z.number().int().nonnegative(),
  inJamLampuHidup: z.number().int().nonnegative(),
  inJamLampuMati: z.number().int().nonnegative(),
  inMenitAir: z.number().int().nonnegative(),
  pupukToggle: z.number().int().min(0).max(1),
  zonaId: z.number().int().positive(),
  reportId: z.number().int().positive().nullable().optional(),
});

export const CreatePlcTelemetrySchema = PlcTelemetrySchema.omit({
  id: true,
  timestamp: true,
});

export const UpdatePlcTelemetrySchema = PlcTelemetrySchema.partial();

export type PlcTelemetryDto = z.infer<typeof PlcTelemetrySchema>;
export type CreatePlcTelemetryDto = z.infer<typeof CreatePlcTelemetrySchema>;
export type UpdatePlcTelemetryDto = z.infer<typeof UpdatePlcTelemetrySchema>;
