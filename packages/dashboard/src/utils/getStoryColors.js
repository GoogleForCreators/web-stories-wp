/*
 * Copyright 2020 Google LLC
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
/**
 * External dependencies
 */
import { parseToRgb } from 'polished';

/**
 * Colors in the story-editor are shaped as `color: {r: '', g: '', b: ''}`
 * while the dashboard relies on hex.
 * When a template is selected to be used as a story
 * we need to convert those hex codes to rgb.
 *
 * @param {Array} colors an array holding hex colors, holds objects that contain `color`.
 * @return {Array} of clean colors as rgb values.
 */
const getStoryColors = (colors) => {
  return colors
    .map(({ color }) => {
      if (!color || color?.toString().charAt(0) !== '#') {
        return null;
      }
      const parsedColor = parseToRgb(color);

      const { red: r, green: g, blue: b } = parsedColor;
      return { color: { r, g, b } };
    })
    .filter((color) => color);
};

export { getStoryColors };
