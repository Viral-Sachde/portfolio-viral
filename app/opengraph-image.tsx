import { ImageResponse } from "next/og";
import { MosaicMark } from "@/lib/brand";

export const alt = "Viral Sachde, Forward Deployed / Solutions Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const strip = ["#0A84FF", "#0A84FF", "#1C3AA9", "#34C759", "#34C759", "#FFD60A", "#F2B705", "#0A84FF", "#1A7F37", "#34C759", "#1C3AA9", "#0A84FF"];
const heights = [3, 4, 2, 5, 4, 3, 2, 4, 5, 3, 4, 2];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", flexDirection: "column", padding: 80, position: "relative" }}>
        <MosaicMark size={96} radius={22} />
        <div style={{ marginTop: 56, fontSize: 104, fontWeight: 700, letterSpacing: -5, color: "#0A0A0A" }}>Viral Sachde</div>
        <div style={{ marginTop: 12, fontSize: 40, color: "#0A0A0A" }}>Forward Deployed / Solutions Engineer</div>
        <div style={{ marginTop: 8, fontSize: 32, color: "#6E6E73" }}>Full Stack + AI · Ahmedabad</div>
        <div style={{ position: "absolute", right: 0, bottom: 0, display: "flex", alignItems: "flex-end" }}>
          {strip.map((c, i) => (
            <div key={i} style={{ width: 40, height: heights[i] * 40, background: c }} />
          ))}
        </div>
      </div>
    ),
    size
  );
}
