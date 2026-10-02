import z from "zod";

export const FertigasiZoneSchema = z.object({
  id: z.number().int().positive(),
  faseTumbuh: z.string().min(1, "Fase tumbuh tidak boleh kosong"),
  dosisNitrogen: z.number().int().nonnegative("Dosis tidak boleh negatif"),
  dosisPosfor: z.number().int().nonnegative("Dosis tidak boleh negatif"),
  dosisKalium: z.number().int().nonnegative("Dosis tidak boleh negatif"),
  targetEcMin: z.number().nonnegative(),
  targetEcMax: z.number().nonnegative(),
  targetPhMin: z.number().nonnegative(),
  targetPhMax: z.number().nonnegative(),
  zonaId: z.number().int().positive(),
  updatedAt: z.coerce.date().optional(),
});

export const SetFertigasiSchema = FertigasiZoneSchema.omit({
  id: true,
  zonaId: true,
  updatedAt: true,
})
  .refine((data) => data.targetEcMax >= data.targetEcMin, {
    message: "Target EC Maksimal tidak boleh lebih kecil dari EC Minimal",
    path: ["targetEcMax"],
  })
  .refine((data) => data.targetPhMax >= data.targetPhMin, {
    message: "Target pH Maksimal tidak boleh lebih kecil dari pH Minimal",
    path: ["targetPhMax"],
  });

export type FertigasiZoneDto = z.infer<typeof FertigasiZoneSchema>;
export type SetFertigasiDto = z.infer<typeof SetFertigasiSchema>;
