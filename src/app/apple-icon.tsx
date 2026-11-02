import { ImageResponse } from "next/og";
import { voxelMarkSvg } from "@/components/icons";
import { defaultTheme, themes } from "@/theme/themes";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const swatch = themes[defaultTheme].swatch;
  const mark = `data:image/svg+xml;base64,${Buffer.from(voxelMarkSvg(swatch)).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: swatch.ground,
        }}
      >
        <img src={mark} width={104} height={120} alt="" />
      </div>
    ),
    size,
  );
}
