import { ImageResponse } from "next/og";
import { MonogramIcon } from "@/lib/icon-monogram";

const VARIANTS = [
  { id: "16", width: 16, height: 16, inset: 0.1 },
  { id: "32", width: 32, height: 32, inset: 0.1 },
  { id: "48", width: 48, height: 48, inset: 0.11 },
  { id: "192", width: 192, height: 192, inset: 0.12 },
  { id: "512", width: 512, height: 512, inset: 0.12 },
  { id: "512-maskable", width: 512, height: 512, inset: 0.22 },
] as const;

export function generateImageMetadata() {
  return VARIANTS.map(({ id, width, height }) => ({
    id,
    size: { width, height },
    contentType: "image/png" as const,
  }));
}

export default async function Icon({
  id,
}: {
  id: Promise<string | number>;
}) {
  const resolved = String(await id);
  const spec = VARIANTS.find((v) => v.id === resolved) ?? VARIANTS[1];
  const { width, height, inset } = spec;

  return new ImageResponse(
    (
      <MonogramIcon dimension={width} insetFraction={inset} />
    ),
    {
      width,
      height,
    }
  );
}
