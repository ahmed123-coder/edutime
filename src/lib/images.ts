// Configuration centralisée des images
export const IMAGES = {
  // Logos
  LOGO_RECTANGLE: "/assets/logo_rectangle.png",
  LOGO_SQUARE: "/assets/logo_carre.png",
  
  // Landing page
  LANDING_HERO: "/assets/landing.png",
  
  // Placeholders pour les avatars (à remplacer par de vraies images si disponibles)
  AVATARS: {
    DEFAULT: "/assets/logo_carre.png", // Utilise le logo carré comme fallback
  }
} as const;

// Types pour TypeScript
export type ImageKey = keyof typeof IMAGES;
export type AvatarKey = keyof typeof IMAGES.AVATARS;
