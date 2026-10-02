import z from "zod";

export const PerformanceReportSchema = z.object({
  id: z.number().int().positive(),
  date: z.coerce.date({
    error: "Format tanggal tidak valid",
  }),
  estimasiHasil: z.number().nonnegative("Estimasi hasil tidak boleh negatif"),
  penggunaanAir: z.number().nonnegative("Penggunaan air tidak boleh negatif"),
  konsumsiNutrisi: z
    .number()
    .nonnegative("Konsumsi nutrisi tidak boleh negatif"),
  waktuAktifCo2: z.number().nonnegative("Waktu aktif CO2 tidak boleh negatif"),
});

export const CreatePerformanceReportSchema = PerformanceReportSchema.omit({
  id: true,
});

export const UpdatePerformanceReportSchema = PerformanceReportSchema.omit({
  id: true,
}).partial();

export type PerformanceReportDto = z.infer<typeof PerformanceReportSchema>;
export type CreatePerformanceReportDto = z.infer<
  typeof CreatePerformanceReportSchema
>;
export type UpdatePerformanceReportDto = z.infer<
  typeof UpdatePerformanceReportSchema
>;
