import { Cormorant_Upright } from "next/font/google";

/**
 * Serif half of the site wordmark — Cormorant Upright.
 * Google Fonts tops out at 700; UI uses font-extrabold (800) so the browser may synthesize weight.
 */
export const wordmarkMichaelsdailybrief = Cormorant_Upright({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
