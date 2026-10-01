import z from "zod";

export const FaseTumbuhEnum = z.enum(["VEGETATIF", "GENERATIF"]);

export const FertigationZoneSchema = z.object({
  id: z.number().int().positive(),
  faseTumbuh: FaseTumbuhEnum,
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

export const UpdateDosisNpkSchema = z.object({
  faseTumbuh: FaseTumbuhEnum,
  dosisNitrogen: z.number().int().nonnegative("Dosis Nitrogen (N) harus diisi"),
  dosisPosfor: z.number().int().nonnegative("Dosis Fosfor (P) harus diisi"),
  dosisKalium: z.number().int().nonnegative("Dosis Kalium (K) harus diisi"),
});

export const UpdateTargetParameterSchema = z
  .object({
    targetEcMin: z.number().nonnegative(),
    targetEcMax: z.number().nonnegative(),
    targetPhMin: z.number().nonnegative(),
    targetPhMax: z.number().nonnegative(),
  })
  .refine((data) => data.targetEcMax >= data.targetEcMin, {
    message: "Target EC Maksimal tidak boleh lebih kecil dari EC Minimal",
    path: ["targetEcMax"],
  })
  .refine((data) => data.targetPhMax >= data.targetPhMin, {
    message: "Target pH Maksimal tidak boleh lebih kecil dari pH Minimal",
    path: ["targetPhMax"],
  });

export const TankStatusResponseSchema = z.object({
  tangkiN: z.number().min(0).max(100),
  tangkiP: z.number().min(0).max(100),
  tangkiK: z.number().min(0).max(100),
  isLow: z.boolean().describe("Bernilai true jika ada tangki di bawah 20%"),
});

export const SetFertigationSchema = FertigationZoneSchema.omit({
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

export type FertigasiZoneDto = z.infer<typeof FertigationZoneSchema>;
export type UpdateDosisNpkDto = z.infer<typeof UpdateDosisNpkSchema>;
export type UpdateTargetParameterDto = z.infer<
  typeof UpdateTargetParameterSchema
>;
export type TankStatusResponseDto = z.infer<typeof TankStatusResponseSchema>;
export type SetFertigasiDto = z.infer<typeof SetFertigationSchema>;
