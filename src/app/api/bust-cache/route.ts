import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { THEME_CACHE_TAG } from "@/lib/theme/get-settings";

export async function GET() {
  revalidatePath("/", "layout");
  revalidateTag(THEME_CACHE_TAG, "max");
  return NextResponse.json({ success: true, message: "Cache busted!" });
}
