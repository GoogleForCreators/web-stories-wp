export async function getFonts(params) {
  let { default: fonts } = await import(
    /* webpackChunkName: "chunk-fonts" */ '@googleforcreators/fonts/fonts.json' // eslint-disable-line import/no-internal-modules -- This is fine here.
  );

  fonts = fonts.map((font) => ({
    id: font.family,
    name: font.family,
    value: font.family,
    ...font,
  }));

  if (params.include) {
    const include = params.include.split(',');
    fonts = fonts.filter(({ family }) => include.includes(family));
  }

  if (params.search) {
    fonts = fonts.filter(({ family }) =>
      family.toLowerCase().includes(params.search)
    );
  }

  return fonts;
}
