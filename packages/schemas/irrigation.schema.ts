import { z } from "zod";

export const IrrigationZoneSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Nama zona tidak boleh kosong"),
  status: z.string().min(1, "Status tidak boleh kosong"),
  lajuAlir: z.number().nonnegative(),
  targetDurasi: z.string().min(1, "Target durasi harus diisi"),
  targetNpk: z.string().min(1, "Target NPK harus diisi"),
  terakhirJalan: z.coerce.date().nullable(),

  mulaiTanam: z.coerce.date().nullable().optional(),
  targetPanen: z.coerce.date().nullable().optional(),
  siklusDasar: z.number().int().nullable().optional(),
});

export const IrrigationScheduleResponseSchema = z.object({
  zoneId: z.number(),
  zoneName: z.string(),
  mulaiTanam: z.date().nullable(),
  targetPanen: z.date().nullable(),
  siklusDasar: z.number().nullable(),
  hariSetelahTanam: z.number(),
  formatHstUi: z.string(),
});

export const SetJadwalSchema = z.object({
  mulaiTanam: z.coerce.date(),
  targetPanen: z.coerce.date(),
  siklusDasar: z.number().int().positive("Siklus dasar harus lebih dari 0"),
});

// export const CreateIrrigationZoneSchema = IrrigationZoneSchema.omit({
//   id: true,
// });
// export const UpdateIrrigationZoneSchema = IrrigationZoneSchema.partial();

export type IrrigationZoneDto = z.infer<typeof IrrigationZoneSchema>;
// export type CreateIrrigationZoneDto = z.infer<
//   typeof CreateIrrigationZoneSchema
// >;
// export type UpdateIrrigationZoneDto = z.infer<
//   typeof UpdateIrrigationZoneSchema
// >;
export type IrrigationScheduleResponseDTO = z.infer<
  typeof IrrigationScheduleResponseSchema
>;

export type SetJadwalDto = z.infer<typeof SetJadwalSchema>;
