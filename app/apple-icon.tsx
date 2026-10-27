import { ImageResponse } from "next/og";
import { MosaicMark } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS applies its own rounded mask, so the square stays square.
export default function AppleIcon() {
  return new ImageResponse(<MosaicMark size={180} radius={0} />, size);
}
