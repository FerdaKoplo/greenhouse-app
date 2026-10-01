import z from "zod";

export const ValveControlSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Nama valve tidak boleh kosong"),
  type: z.string().min(1, "Tipe valve tidak boleh kosong"),
  isOpen: z.boolean().default(false),
  zonaId: z.number().int().positive().nullable().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const CreateValveControlSchema = ValveControlSchema.omit({
  id: true,
  updatedAt: true,
});

export const UpdateValveControlSchema = ValveControlSchema.omit({
  id: true,
  updatedAt: true,
}).partial();

export const ToggleValveSchema = z.object({
  isOpen: z.boolean(),
});

export type ValveControlDto = z.infer<typeof ValveControlSchema>;
export type CreateValveControlDto = z.infer<typeof CreateValveControlSchema>;
export type UpdateValveControlDto = z.infer<typeof UpdateValveControlSchema>;
export type ToggleValveDto = z.infer<typeof ToggleValveSchema>;
