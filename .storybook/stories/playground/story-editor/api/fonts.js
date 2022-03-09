/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
