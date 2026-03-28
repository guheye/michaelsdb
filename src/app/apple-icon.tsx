import { ImageResponse } from "next/og";
import { MonogramIcon } from "@/lib/icon-monogram";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (<MonogramIcon dimension={180} insetFraction={0.12} />),
    {
      ...size,
    }
  );
}
