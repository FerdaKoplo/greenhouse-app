import { z } from "zod";

export const IrrigationZoneSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Nama zona tidak boleh kosong"),
  status: z.string().min(1, "Status tidak boleh kosong"),
  lajuAlir: z.number().nonnegative(),
  targetDurasi: z.string().min(1, "Target durasi harus diisi"),
  targetNpk: z.string().min(1, "Target NPK harus diisi"),
  terakhirJalan: z.coerce.date().nullable(),
});

export const CreateIrrigationZoneSchema = IrrigationZoneSchema.omit({
  id: true,
});

export const UpdateIrrigationZoneSchema = IrrigationZoneSchema.partial();

export type IrrigationZoneDto = z.infer<typeof IrrigationZoneSchema>;
export type CreateIrrigationZoneDto = z.infer<
  typeof CreateIrrigationZoneSchema
>;
export type UpdateIrrigationZoneDto = z.infer<
  typeof UpdateIrrigationZoneSchema
>;
