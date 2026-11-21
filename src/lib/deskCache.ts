import { revalidatePath } from "next/cache";

export function revalidateDesk(paths: string[]) {
  for (const path of new Set(paths)) revalidatePath(path);
}
