import { AppError } from "./error.lib";

interface VerifyRecordArgs<TModel> {
  idParam: string;
  findUnique: (query: { where: { id: number } }) => Promise<TModel | null>;
  notFoundMessage?: string;
}

export async function getValidRecordOrThrow<TModel>(
  args: VerifyRecordArgs<TModel>,
): Promise<{ id: number; record: TModel }> {
  const id = parseInt(args.idParam, 10);
  if (isNaN(id)) {
    throw new AppError("Format ID tidak valid. Harus berupa angka.", 400);
  }

  const record = await args.findUnique({
    where: { id },
  });

  if (!record) {
    throw new AppError(args.notFoundMessage ?? "Data tidak ditemukan", 404);
  }

  return { id, record };
}
