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
 * External dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import getUpdatedSizeAndPosition from '../../../utils/getUpdatedSizeAndPosition';
import updateProperties from '../../inspector/design/updateProperties';
import { focusStyle, inputContainerStyleOverride } from '../../panels/shared';
import { MIN_MAX } from '../../panels/design/textStyle/font';
// TODO: https://github.com/GoogleForCreators/web-stories-wp/issues/10799
import { Input } from './shared';

function FontSize() {
  const { fontSize, updateSelectedElements } = useStory(
    ({ state, actions }) => ({
      fontSize: state.selectedElements[0].fontSize,
      updateSelectedElements: actions.updateSelectedElements,
    })
  );

  const pushUpdate = useCallback(
    (update) => {
      updateSelectedElements({
        properties: (element) => {
          const updates = updateProperties(element, update, true);
          const sizeUpdates = getUpdatedSizeAndPosition({
            ...element,
            ...updates,
          });
          return {
            ...updates,
            ...sizeUpdates,
          };
        },
      });
    },
    [updateSelectedElements]
  );

  return (
    <Input
      aria-label={__('Font size', 'web-stories')}
      isFloat
      value={fontSize}
      onChange={(evt, value) => pushUpdate({ fontSize: value })}
      min={MIN_MAX.FONT_SIZE.MIN}
      max={MIN_MAX.FONT_SIZE.MAX}
      placeholder={fontSize}
      containerStyleOverride={inputContainerStyleOverride}
      selectButtonStylesOverride={focusStyle}
    />
  );
}

export default FontSize;
