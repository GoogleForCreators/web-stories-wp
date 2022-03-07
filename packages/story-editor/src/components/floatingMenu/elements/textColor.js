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
import useRichTextFormatting from '../../panels/design/textStyle/useRichTextFormatting';
import updateProperties from '../../inspector/design/updateProperties';
import { useStory } from '../../../app';
import { Color, useProperties } from './shared';

function TextColor() {
  const { content, type } = useProperties(['content', 'type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const pushUpdate = useCallback(
    (update) => {
      updateSelectedElements({
        properties: (element) => {
          const updates = updateProperties(element, update, true);
          return {
            ...element,
            ...updates,
          };
        },
      });
    },
    [updateSelectedElements]
  );
  const {
    textInfo: { color },
    handlers: { handleSetColor },
  } = useRichTextFormatting([{ content, type }], pushUpdate);

  return (
    <Color
      label={__('Text color', 'web-stories')}
      value={color}
      allowsSavedColors
      onChange={handleSetColor}
      hasInputs={false}
      hasEyeDropper
      allowsOpacity={false}
    />
  );
}

export default TextColor;
