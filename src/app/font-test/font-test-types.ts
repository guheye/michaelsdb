export type FontOption = {
  id: string;
  name: string;
  family: string;
  weight: number;
  fontStyle?: "normal" | "italic";
  url: string;
  description: string;
  casing: "uppercase" | "title";
  letterSpacing: string;
};
