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
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import useRichTextFormatting from '../../panels/design/textStyle/useRichTextFormatting';
import updateProperties from '../../inspector/design/updateProperties';
import { useStory } from '../../../app';
import { Color, useProperties } from './shared';

function TextColor() {
  const { content } = useProperties(['content']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const pushUpdate = useCallback(
    (update) => {
      trackEvent('floating_menu', {
        name: 'set_text_color',
        element: 'text',
      });
      updateSelectedElements({
        properties: (element) => updateProperties(element, update, true),
      });
    },
    [updateSelectedElements]
  );
  const {
    textInfo: { color },
    handlers: { handleSetColor },
  } = useRichTextFormatting([{ content, type: 'text' }], pushUpdate);

  return (
    <Color
      label={__('Text color', 'web-stories')}
      value={color}
      allowsSavedColors
      onChange={handleSetColor}
      hasInputs={false}
      hasEyedropper
      allowsOpacity
      allowsGradient={false}
    />
  );
}

export default TextColor;
