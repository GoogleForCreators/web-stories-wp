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
import { getDefinitionForType, ELEMENT_TYPES } from '../../../elements';
import objectPick from '../../../utils/objectPick';
import { getElementStyles, getDefaultPropertiesForType } from '../utils';

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

const expectedMediaStyles = objectPick(ALL_PROPERTIES, [
  'border',
  'borderRadius',
  'opacity',
  'overlay',
]);
const expectedShapeStyles = objectPick(ALL_PROPERTIES, [
  'backgroundColor',
  'opacity',
]);
const expectedTextStyles = objectPick(ALL_PROPERTIES, [
  'backgroundColor',
  'backgroundTextMode',
  'border',
  'borderRadius',
  'opacity',
  'padding',
  'textAlign',
  'font',
  'fontSize',
  'lineHeight',
]);

const { clearableAttributes: clearableGifAttributes } =
  getDefinitionForType('gif');
const { clearableAttributes: clearableImageAttributes } =
  getDefinitionForType('image');
const { clearableAttributes: clearableShapeAttributes } =
  getDefinitionForType('shape');
const { clearableAttributes: clearableTextAttributes } =
  getDefinitionForType('text');
const { clearableAttributes: clearableVideoAttributes } =
  getDefinitionForType('video');

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
    ${ELEMENT_TYPES.IMAGE} | ${expectedMediaStyles}
    ${ELEMENT_TYPES.GIF}   | ${expectedMediaStyles}
    ${ELEMENT_TYPES.VIDEO} | ${expectedMediaStyles}
    ${ELEMENT_TYPES.SHAPE} | ${expectedShapeStyles}
    ${ELEMENT_TYPES.TEXT}  | ${expectedTextStyles}
  `(
    'should pick the correct properties for a `$type` element',
    ({ type, expectedProperties }) => {
      const result = getElementStyles({ ...ALL_PROPERTIES, type });

      expect(result).toStrictEqual(expectedProperties);
    }
  );
});

describe('getDefaultPropertiesForType', () => {
  it('should return `null` if the element does not have the correct structure', () => {
    // No element type
    expect(getDefaultPropertiesForType({})).toBeNull();

    // Element type does not exist
    expect(getDefaultPropertiesForType({ type: 'banana' })).toBeNull();
  });

  it.each`
    type                   | expectedProperties
    ${ELEMENT_TYPES.IMAGE} | ${clearableImageAttributes}
    ${ELEMENT_TYPES.GIF}   | ${clearableGifAttributes}
    ${ELEMENT_TYPES.VIDEO} | ${clearableVideoAttributes}
    ${ELEMENT_TYPES.SHAPE} | ${clearableShapeAttributes}
    ${ELEMENT_TYPES.TEXT}  | ${clearableTextAttributes}
  `(
    'should return the default properties for a `$type` element',
    ({ type, expectedProperties }) => {
      const result = getDefaultPropertiesForType(type);

      expect(result).toStrictEqual(expectedProperties);
    }
  );
});
