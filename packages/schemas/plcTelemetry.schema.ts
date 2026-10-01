import { z } from "zod";

export const PlcTelemetrySchema = z.object({
  id: z.number().int().positive(),
  timestamp: z.coerce.date(),
  inJamAir: z.number().int().nonnegative(),
  inJamLampuHidup: z.number().int().nonnegative(),
  inJamLampuMati: z.number().int().nonnegative(),
  inMenitAir: z.number().int().nonnegative(),
  outEc: z.number(),
  outKadarAir: z.number(),
  outKalium: z.number(),
  outKelembaban: z.number(),
  outNitrogen: z.number(),
  outPh: z.number(),
  outPhospor: z.number(),
  outSuhu: z.number(),
  pupukToggle: z.number().int().min(0).max(1),
  zonaId: z.number().int().positive("ID Zona harus diisi"),

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
