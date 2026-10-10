export const APP_COLORS = {
  background: "#F3F4F6",
  surface: "#FFFFFF",
  surfaceMuted: "#E5E7EB",
  ink: "#1F2937",
  inkSoft: "#4B5563",
  inkFaint: "#6B7280",
  border: "#D1D5DB",
  brand: "#FFB900",
  brandDark: "#030957",
  brandPale: "#FFF4CC",
  success: "#15803D",
  successPale: "#DCFCE7",
  danger: "#DC2626",
  dangerPale: "#FEE2E2",
  warning: "#B77900",
  warningPale: "#FEF3C7",
  white: "#FFFFFF",
} as const;

export const APP_SHADOW = {
  shadowColor: "#030957",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.07,
  shadowRadius: 18,
  elevation: 3,
} as const;

export const APP_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const APP_RADII = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const APP_TYPOGRAPHY = {
  display: { fontSize: 28, lineHeight: 36, fontWeight: "900" as const },
  title: { fontSize: 20, lineHeight: 28, fontWeight: "900" as const },
  body: { fontSize: 13, lineHeight: 20, fontWeight: "500" as const },
  caption: { fontSize: 10, lineHeight: 15, fontWeight: "700" as const },
} as const;
