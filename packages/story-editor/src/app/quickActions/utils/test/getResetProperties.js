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
import { RESET_PROPERTIES } from '../../../highlights/constants';
import getResetProperties from '../getResetProperties';

describe('getResetProperties', () => {
  it.each`
    selectedElement                                             | selectedElementAnimations       | result
    ${{ overlay: '', id: '1234' }}                              | ${[]}                           | ${[]}
    ${{ overlay: { type: 'linear' }, id: '1234' }}              | ${[]}                           | ${[RESET_PROPERTIES.OVERLAY]}
    ${{ overlay: { type: 'linear' }, id: '1234' }}              | ${[{ type: 'effect-fade-in' }]} | ${[RESET_PROPERTIES.OVERLAY, RESET_PROPERTIES.ANIMATION]}
    ${{ overlay: '', id: '1234' }}                              | ${[{ type: 'effect-fade-in' }]} | ${[RESET_PROPERTIES.ANIMATION]}
    ${{ overlay: { type: 'linear' }, id: '1234', opacity: 60 }} | ${[{ type: 'effect-fade-in' }]} | ${[RESET_PROPERTIES.OVERLAY, RESET_PROPERTIES.ANIMATION, RESET_PROPERTIES.STYLES]}
    ${{ opacity: 60 }}                                          | ${[]}                           | ${[RESET_PROPERTIES.STYLES]}
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
