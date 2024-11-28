// Default theme colors
export const defaultPrimaryColor = '#3730A3'; // Base primary color
export const defaultLightColor = '#EEF2FF'; // Light background
export const defaultDarkColor = '#171717'; // Dark background

// Color constants
export const COLORS = {
  black: '#171717',
  white: '#EEF2FF',
  darkGray: '#262626',
  lightGray: '#404040',
  orange: '#F97316',
  gray: '#6B7280',
} as const;

// Status colors with background and text variations
export const STATUS_COLORS = {
  pending: {
    background: 'rgba(107, 114, 128, 0.25)', // gray-25%
    text: COLORS.gray,
  },
  cancelled: {
    background: 'rgba(249, 115, 22, 0.25)', // orange-25%
    text: COLORS.orange,
  },
} as const;

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Determine if color is light or dark
export function isLightColor(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const luminance = getLuminance(r, g, b);
  return luminance > 0.179; // This threshold can be adjusted
}

// Get contrasting text color
export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? COLORS.black : COLORS.white;
}

// Calculate color variations
export function calculateColorVariations(baseColor: string) {
  return {
    primary: baseColor,
    primaryLight: adjustOpacity(baseColor, 0.8), // 80% opacity for lighter shade
    primaryLighter: adjustOpacity(baseColor, 0.5), // 50% opacity for even lighter
    primaryLightest: adjustOpacity(baseColor, 0.1), // 10% opacity for background tint
    primaryForeground: getContrastColor(baseColor), // Contrasting text color
  };
}

// Helper to adjust color opacity
function adjustOpacity(hex: string, opacity: number): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generate CSS variables object
export function generateThemeVariables(primaryColor = defaultPrimaryColor) {
  const colors = calculateColorVariations(primaryColor);
  
  return {
    light: {
      '--background': COLORS.white,
      '--foreground': COLORS.black,
      '--primary': colors.primary,
      '--primary-foreground': colors.primaryForeground,
      '--primary-light': colors.primaryLight,
      '--primary-lighter': colors.primaryLighter,
      '--primary-lightest': colors.primaryLightest,
      '--muted': COLORS.lightGray,
      '--muted-foreground': adjustOpacity(COLORS.black, 0.6),
      '--card': '#FFFFFF',
      '--card-foreground': COLORS.black,
      '--border': adjustOpacity(COLORS.black, 0.1),
      '--input': adjustOpacity(COLORS.black, 0.1),
      '--destructive': '#EF4444',
      '--destructive-foreground': '#FFFFFF',
      // Status colors
      '--status-pending-bg': STATUS_COLORS.pending.background,
      '--status-pending-text': STATUS_COLORS.pending.text,
      '--status-cancelled-bg': STATUS_COLORS.cancelled.background,
      '--status-cancelled-text': STATUS_COLORS.cancelled.text,
    },
    dark: {
      '--background': COLORS.black,
      '--foreground': COLORS.white,
      '--primary': colors.primary,
      '--primary-foreground': colors.primaryForeground,
      '--primary-light': colors.primaryLight,
      '--primary-lighter': colors.primaryLighter,
      '--primary-lightest': adjustOpacity(colors.primary, 0.15),
      '--muted': COLORS.darkGray,
      '--muted-foreground': adjustOpacity(COLORS.white, 0.6),
      '--card': COLORS.darkGray,
      '--card-foreground': COLORS.white,
      '--border': adjustOpacity(COLORS.white, 0.1),
      '--input': adjustOpacity(COLORS.white, 0.1),
      '--destructive': '#EF4444',
      '--destructive-foreground': '#FFFFFF',
      // Status colors - same in dark mode
      '--status-pending-bg': STATUS_COLORS.pending.background,
      '--status-pending-text': STATUS_COLORS.pending.text,
      '--status-cancelled-bg': STATUS_COLORS.cancelled.background,
      '--status-cancelled-text': STATUS_COLORS.cancelled.text,
    }
  };
}