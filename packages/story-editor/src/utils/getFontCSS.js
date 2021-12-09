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

function getFontFormat(src) {
  const fileExtension = src.split(/[#?]/)[0].split('.').pop().trim();

  switch (fileExtension) {
    case 'woff':
    case 'woff2':
      return fileExtension;
    case 'ttf':
      return 'truetype';
    default:
      return null;
  }
}

function getFontCSS(name, src) {
  const format = getFontFormat(src);

  if (!format) {
    return null;
  }

  return `
  @font-face {
    font-family: "${name}";
    src: url('${src}') format('${format}');
    font-weight: normal;
    font-display:swap;
  }
  `;
}

export default getFontCSS;
