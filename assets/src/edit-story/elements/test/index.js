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
 * Internal dependencies
 */
import { createNewElement, createPage } from '../';
describe('Element', () => {
  describe('createNewElement', () => {
    it('should create an element with correct attributes', () => {
      const atts = {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
      };
      const textElement = createNewElement('text', atts);
      expect(textElement.rotationAngle).toStrictEqual(0);
      expect(textElement.width).toStrictEqual(100);
      expect(textElement.fontFallback).toStrictEqual([
        'Helvetica Neue',
        'Helvetica',
        'sans-serif',
      ]);
    });
  });

  describe('createPage', () => {
    it('should create a Page element with default background element', () => {
      const page = createPage();
      expect(page.backgroundElementId).toBeDefined();
      expect(page.elements).toHaveLength(1);
      expect(page.elements[0].id).toStrictEqual(page.backgroundElementId);
    });
  });
});
