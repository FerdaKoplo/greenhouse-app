import { z } from "zod";

export const PerformanceReportSchema = z.object({
  id: z.number().int().positive(),
  date: z.coerce.date(),
  estimasiHasil: z.number().nonnegative("Estimasi hasil tidak boleh negatif"),
  penggunaanAir: z.number().nonnegative("Penggunaan air tidak boleh negatif"),
  konsumsiNutrisi: z
    .number()
    .nonnegative("Konsumsi nutrisi tidak boleh negatif"),
  waktuAktifCo2: z
    .number()
    .min(0)
    .max(100, "Persentase waktu aktif CO2 maksimal 100%"),
});

export const CreatePerformanceReportSchema = PerformanceReportSchema.omit({
  id: true,
});

export const UpdatePerformanceReportSchema = PerformanceReportSchema.partial();

export type PerformanceReportDto = z.infer<typeof PerformanceReportSchema>;
export type CreatePerformanceReportDto = z.infer<
  typeof CreatePerformanceReportSchema
>;
export type UpdatePerformanceReportDto = z.infer<
  typeof UpdatePerformanceReportSchema
>;
