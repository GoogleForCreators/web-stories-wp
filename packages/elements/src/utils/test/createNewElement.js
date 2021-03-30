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
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../constants';
import createNewElement from '../createNewElement';

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
