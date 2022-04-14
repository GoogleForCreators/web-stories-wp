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
import styled from 'styled-components';
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  NumericInput,
  CONTEXT_MENU_SKIP_ELEMENT,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import getUpdatedSizeAndPosition from '../../../utils/getUpdatedSizeAndPosition';
import updateProperties from '../../style/updateProperties';
import {
  focusStyle,
  inputContainerStyleOverride,
} from '../../panels/shared/styles';
import { MIN_MAX } from '../../panels/design/textStyle/font';
import { FocusTrapButton, handleReturnTrappedFocus } from './shared';

const Input = styled(NumericInput).attrs({
  inputClassName: CONTEXT_MENU_SKIP_ELEMENT,
})`
  width: 50px;
  flex: 0 0 50px;
`;

const FONT_SIZE_LABEL = __('Font size', 'web-stories');

function FontSize() {
  const inputRef = useRef();
  const buttonRef = useRef();
  const { fontSize, updateSelectedElements } = useStory(
    ({ state, actions }) => ({
      fontSize: state.selectedElements[0].fontSize,
      updateSelectedElements: actions.updateSelectedElements,
    })
  );

  const pushUpdate = useCallback(
    (update) => {
      trackEvent('floating_menu', {
        name: 'set_font_size',
      });

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
    <FocusTrapButton
      ref={buttonRef}
      inputRef={inputRef}
      inputLabel={FONT_SIZE_LABEL}
    >
      <Input
        tabIndex={-1}
        ref={inputRef}
        aria-label={FONT_SIZE_LABEL}
        isFloat
        value={fontSize}
        onChange={(evt, value) => pushUpdate({ fontSize: value })}
        min={MIN_MAX.FONT_SIZE.MIN}
        max={MIN_MAX.FONT_SIZE.MAX}
        placeholder={fontSize}
        containerStyleOverride={inputContainerStyleOverride}
        selectButtonStylesOverride={focusStyle}
        onKeyDown={(e) => {
          handleReturnTrappedFocus(e, buttonRef);
        }}
      />
    </FocusTrapButton>
  );
}

export default FontSize;
