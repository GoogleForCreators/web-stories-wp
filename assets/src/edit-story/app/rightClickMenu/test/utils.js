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
/**
 * Internal dependencies
 */
import { ELEMENT_TYPES } from '../../story';
import objectPick from '../../../utils/objectPick';
import {
  getElementStyles,
  getDefaultPropertiesForType,
  MEDIA_STYLE_PROPERTIES,
  SHAPE_STYLE_PROPERTIES,
  TEXT_STYLE_PROPERTIES,
  DEFAULT_TEXT_PRESETS,
  PROPERTY_DEFAULTS,
} from '../utils';

const ALL_PROPERTIES = {
  // style properties
  backgroundColor: 'blue',
  backgroundTextMode: 'blue again',
  border: '1px solid salmon',
  borderRadius: '3px',
  font: 'papyrus',
  fontSize: '12em',
  fontWeight: 'bold',
  lineHeight: '1.9',
  mask: 'none',
  opacity: '0.5',
  overlay: 'some-overlay-here',
  padding: '4px',
  textAlign: 'center',

  // extra properties that will be ignored
  flavor: 'banana',
  shape: 'triangle',
  grapes: 'yes, thank you',
};

describe('getElementStyles', () => {
  it('should return `null` if the element does not have the correct structure', () => {
    // No element
    expect(getElementStyles()).toBeNull();

    // No element type
    expect(getElementStyles({})).toBeNull();

    // Element type does not exist
    expect(getElementStyles({ type: 'banana' })).toBeNull();
  });

  it.each`
    type                   | expectedProperties
    ${ELEMENT_TYPES.IMAGE} | ${MEDIA_STYLE_PROPERTIES}
    ${ELEMENT_TYPES.GIF}   | ${MEDIA_STYLE_PROPERTIES}
    ${ELEMENT_TYPES.VIDEO} | ${MEDIA_STYLE_PROPERTIES}
    ${ELEMENT_TYPES.SHAPE} | ${SHAPE_STYLE_PROPERTIES}
    ${ELEMENT_TYPES.TEXT}  | ${TEXT_STYLE_PROPERTIES}
  `(
    'should pick the correct properties for a `$type` element',
    ({ type, expectedProperties }) => {
      const result = getElementStyles({ ...ALL_PROPERTIES, type });

      // Result should only have the expected properties
      const expectedPropertiesSet = new Set(expectedProperties);
      const returnedPropertiesSet = new Set(Object.keys(result));

      expect(expectedPropertiesSet.size).toBe(returnedPropertiesSet.size);
      for (const property of expectedPropertiesSet) {
        expect(returnedPropertiesSet.has(property)).toBeTrue();
      }
    }
  );
});

describe('getDefaultPropertiesForType', () => {
  const expectedMediaDefaults = objectPick(
    PROPERTY_DEFAULTS,
    MEDIA_STYLE_PROPERTIES
  );
  const expectedShapeDefaults = objectPick(
    PROPERTY_DEFAULTS,
    SHAPE_STYLE_PROPERTIES
  );

  it('should return `null` if the element does not have the correct structure', () => {
    // No element type
    expect(getDefaultPropertiesForType({})).toBeNull();

    // Element type does not exist
    expect(getDefaultPropertiesForType({ type: 'banana' })).toBeNull();
  });

  it.each`
    type                   | expectedProperties
    ${ELEMENT_TYPES.IMAGE} | ${expectedMediaDefaults}
    ${ELEMENT_TYPES.GIF}   | ${expectedMediaDefaults}
    ${ELEMENT_TYPES.VIDEO} | ${expectedMediaDefaults}
    ${ELEMENT_TYPES.SHAPE} | ${expectedShapeDefaults}
    ${ELEMENT_TYPES.TEXT}  | ${DEFAULT_TEXT_PRESETS}
  `(
    'should return the default properties for a `$type` element',
    ({ type, expectedProperties }) => {
      const result = getDefaultPropertiesForType(type);

      expect(result).toStrictEqual(expectedProperties);
    }
  );
});
