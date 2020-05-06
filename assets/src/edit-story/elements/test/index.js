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
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../app/font/defaultFonts';
import { createNewElement, createPage } from '../';

describe('Element', () => {
  describe('createNewElement', () => {
    it('should create an element with just default attributes', () => {
      const imageElement = createNewElement('image');
      expect(imageElement).toStrictEqual(
        expect.objectContaining({
          opacity: 100, // a default shared attribute
          scale: 100, // a default media attribute
        })
      );
    });

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
      expect(textElement.font).toMatchObject(TEXT_ELEMENT_DEFAULT_FONT);
    });

    it('should throw if trying to create unknown element type', () => {
      const unknownElementCreator = () => createNewElement('puppy');
      expect(unknownElementCreator).toThrow(/unknown element type: puppy/i);
    });
  });

  describe('createPage', () => {
    it('should create a Page element with default background element', () => {
      const page = createPage();
      expect(page.backgroundElementId).toBeDefined();
      expect(page.elements).toHaveLength(1);
      expect(page.elements[0].id).toStrictEqual(page.backgroundElementId);
    });

    it('should generate new ids when duplicating a page (including bg)', () => {
      const oldElements = [
        { id: 'abc001', isBackground: true, x: 10, y: 20, type: 'shape' },
        { id: 'abc002', x: 110, y: 120, type: 'text' },
        { id: 'abc003', x: 210, y: 220, type: 'image' },
      ];
      const oldPage = {
        id: 'abc000',
        type: 'page',
        backgroundElementId: oldElements[0].id,
        elements: oldElements,
        otherProperty: '45',
      };
      const newPage = createPage(oldPage);

      // Expect same structure but new id's!
      expect(newPage).toStrictEqual({
        id: expect.not.stringMatching(oldPage.id),
        type: 'page',
        otherProperty: '45',
        backgroundElementId: expect.not.stringMatching(
          oldPage.backgroundElementId
        ),
        elements: [
          expect.objectContaining({
            id: expect.not.stringMatching(oldElements[0].id),
            isBackground: true,
            x: 10,
            y: 20,
            type: 'shape',
          }),
          expect.objectContaining({
            id: expect.not.stringMatching(oldElements[1].id),
            x: 110,
            y: 120,
            type: 'text',
          }),
          expect.objectContaining({
            id: expect.not.stringMatching(oldElements[2].id),
            x: 210,
            y: 220,
            type: 'image',
          }),
        ],
      });
      // And bg ids to match
      expect(newPage.elements[0].id).toStrictEqual(newPage.backgroundElementId);
    });
  });
});
