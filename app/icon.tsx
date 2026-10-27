import { ImageResponse } from "next/og";
import { MosaicMark } from "@/lib/brand";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<MosaicMark size={64} radius={12} />, size);
}
