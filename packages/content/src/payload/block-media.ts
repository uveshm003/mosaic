// Upload fields that point at media, by rich-text block slug. Kept free of editor
// imports because the snapshot code, which site builds load, reads it.
export const mediaFieldsByBlock: Readonly<Record<string, readonly string[]>> = {
  image: ['image'],
  flutterDemo: ['poster'],
}
