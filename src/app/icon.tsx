import { ImageResponse } from "next/og";
import { SpritaScoreMark } from "@/lib/brandIcon";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<SpritaScoreMark size={32} />, { ...size });
}