/**
 * useFontsReady hook
 *
 * Returns false until custom fonts are loaded, so the app can
 * show a loading state (e.g., splash screen) while fonts load.
 *
 * Wraps expo-font's useFonts hook. If expo-font is not available,
 * returns true immediately to avoid blocking the app.
 */

let useFontsImpl: ((fontMap: Record<string, unknown>) => [boolean, Error | null]) | null = null;

try {
  useFontsImpl = require('expo-font').useFonts;
} catch {
  useFontsImpl = null;
}

/**
 * Returns `true` once custom fonts are loaded and ready for rendering.
 * If expo-font is unavailable, returns `true` immediately.
 */
export function useFontsReady(): boolean {
  if (!useFontsImpl) {
    // expo-font not available; assume system fonts are fine
    return true;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [fontsLoaded] = useFontsImpl({
    Manrope: require('../../assets/fonts/Manrope-Variable.ttf'),
    'Manrope-Bold': require('../../assets/fonts/Manrope-Variable.ttf'),
    Inter: require('../../assets/fonts/Inter-Variable.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-Variable.ttf'),
  });

  return fontsLoaded;
}
