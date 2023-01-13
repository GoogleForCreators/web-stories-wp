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

/**
 * External dependencies
 */
import { produce } from 'immer';
import { elementIs } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type {
  ReducerState,
  ReducerStateDraft,
  UpdateElementsByFontFamilyProps,
} from '../../../../types';
import { updateElementWithUpdater } from './utils';

/**
 * Update elements by the given font 'family' with the given properties.
 *
 * Elements will be updated through all pages with correct font 'family'.
 *
 * If an empty family or a no matches with family, state is unchanged.
 *
 * If no element with the given family is found, state is unchanged.
 *
 * If given set of properties is empty, state is unchanged.
 *
 * Current selection and page is unchanged.
 */
export const updateElementsByFontFamily = (
  draft: ReducerStateDraft,
  { family, properties: propertiesOrUpdater }: UpdateElementsByFontFamilyProps
) => {
  if (!family) {
    return;
  }

  draft.pages.forEach((page) => {
    page.elements
      .filter(elementIs.text)
      .filter((element) => element.font.family === family)
      .forEach((element) =>
        updateElementWithUpdater(element, propertiesOrUpdater)
      );
  });
};

export default produce<ReducerState, [UpdateElementsByFontFamilyProps]>(
  updateElementsByFontFamily
);
