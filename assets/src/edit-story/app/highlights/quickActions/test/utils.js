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
import { ELEMENT_TYPE, RESET_PROPERTIES } from '../constants';
import { getResetProperties, getSnackbarClearCopy } from '../utils';

describe('quickAction utils', () => {
  describe('getResetProperties', () => {
    it.each`
      selectedElement                                          | selectedElementAnimations       | result
      ${{ backgroundOverlay: '', id: '1234' }}                 | ${[]}                           | ${[]}
      ${{ backgroundOverlay: { type: 'linear' }, id: '1234' }} | ${[]}                           | ${[RESET_PROPERTIES.BACKGROUND_OVERLAY]}
      ${{ backgroundOverlay: { type: 'linear' }, id: '1234' }} | ${[{ type: 'effect-fade-in' }]} | ${[RESET_PROPERTIES.BACKGROUND_OVERLAY, RESET_PROPERTIES.ANIMATION]}
      ${{ backgroundOverlay: '', id: '1234' }}                 | ${[{ type: 'effect-fade-in' }]} | ${[RESET_PROPERTIES.ANIMATION]}
    `(
      'should return array with reset properties',
      ({ selectedElement, selectedElementAnimations, result }) => {
        const resetPropertiesArray = getResetProperties(
          selectedElement,
          selectedElementAnimations
        );

        expect(resetPropertiesArray).toStrictEqual(result);
      }
    );
  });

  describe('getSnackbarClearCopy', () => {
    it.each`
      properties                                                           | elementType                | result
      ${[]}                                                                | ${ELEMENT_TYPE.IMAGE}      | ${''}
      ${['opacity']}                                                       | ${ELEMENT_TYPE.IMAGE}      | ${''}
      ${['daisy', 'sunflower', false, 0]}                                  | ${ELEMENT_TYPE.IMAGE}      | ${''}
      ${[RESET_PROPERTIES.ANIMATION]}                                      | ${ELEMENT_TYPE.IMAGE}      | ${'All animations were removed from the image'}
      ${[RESET_PROPERTIES.BACKGROUND_OVERLAY]}                             | ${ELEMENT_TYPE.BACKGROUND} | ${'All filters were removed from the background'}
      ${[RESET_PROPERTIES.ANIMATION, RESET_PROPERTIES.BACKGROUND_OVERLAY]} | ${ELEMENT_TYPE.BACKGROUND} | ${'All animations and filters were removed from the background'}
    `(
      'should return snackbar copy as expected',
      ({ properties, elementType, result }) => {
        expect(getSnackbarClearCopy(properties, elementType)).toBe(result);
      }
    );
  });
});
