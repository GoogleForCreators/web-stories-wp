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
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { CONTEXT_MENU_SKIP_ELEMENT } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useRichTextFormatting from '../../panels/design/textStyle/useRichTextFormatting';
import updateProperties from '../../style/updateProperties';
import { useStory } from '../../../app';
import {
  Color,
  useProperties,
  FocusTrapButton,
  handleReturnTrappedColorFocus,
} from './shared';

const TEXT_COLOR_LABEL = __('Text color', 'web-stories');

function TextColor() {
  const inputRef = useRef();
  const buttonRef = useRef();
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
    <FocusTrapButton
      ref={buttonRef}
      inputRef={inputRef}
      inputLabel={TEXT_COLOR_LABEL}
    >
      <Color
        tabIndex={-1}
        ref={inputRef}
        label={TEXT_COLOR_LABEL}
        value={color}
        allowsSavedColors
        onChange={handleSetColor}
        hasInputs={false}
        hasEyedropper
        allowsOpacity
        allowsGradient={false}
        className={CONTEXT_MENU_SKIP_ELEMENT}
        onKeyDown={(e, containerRef) =>
          handleReturnTrappedColorFocus(e, buttonRef, containerRef)
        }
      />
    </FocusTrapButton>
  );
}

export default TextColor;
