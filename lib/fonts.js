// lib/fonts.js
import localFont from "next/font/local";

export const bebasNeue = localFont({
  src: "../public/fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas",
  display: "swap",
});

export const dmSans = localFont({
  src: [
    { path: "../public/fonts/DMSans-Light.ttf",   weight: "300", style: "normal" },
    { path: "../public/fonts/DMSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/DMSans-Medium.ttf",  weight: "500", style: "normal" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});