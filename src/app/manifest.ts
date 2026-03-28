import type { MetadataRoute } from "next";
import { BRAND_DISPLAY, BRAND_SHORT } from "@/lib/brand";
import { ICON_BG } from "@/lib/icon-monogram";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_DISPLAY,
    short_name: BRAND_SHORT,
    description:
      "Intellectual conservative news aggregation with AI-reframed headlines. Ideas over tribes.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: ICON_BG,
    theme_color: ICON_BG,
    icons: [
      {
        src: "/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/512-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
