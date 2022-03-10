/*
 * Copyright 2022 Google LLC
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

function andadaFontToAndadaPro({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

const andadaPro = {
  family: 'Andada Pro',
  fallbacks: ['serif'],
  weights: [400, 500, 600, 700, 800],
  styles: ['regular', 'italic'],
  variants: [
    [0, 400],
    [0, 500],
    [0, 600],
    [0, 700],
    [0, 800],
    [1, 400],
    [1, 500],
    [1, 600],
    [1, 700],
    [1, 800],
  ],
  service: 'fonts.google.com',
  metrics: {
    upm: 1000,
    asc: 942,
    des: -235,
    tAsc: 942,
    tDes: -235,
    tLGap: 0,
    wAsc: 1100,
    wDes: 390,
    xH: 494,
    capH: 705,
    yMin: -382,
    yMax: 1068,
    hAsc: 942,
    hDes: -235,
    lGap: 0,
  },
  id: 'Andada Pro',
  name: 'Andada Pro',
  value: 'Andada Pro',
};

function updateElement(element) {
  if (element.type === 'text' && element?.font?.family === 'Andada') {
    element.font = {
      ...element.font,
      ...andadaPro,
    };
  }
  return element;
}

export default andadaFontToAndadaPro;
