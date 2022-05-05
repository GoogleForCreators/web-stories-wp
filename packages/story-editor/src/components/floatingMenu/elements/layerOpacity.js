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
import styled from 'styled-components';
import { __, _x } from '@googleforcreators/i18n';
import {
  Icons,
  NumericInput,
  CONTEXT_MENU_SKIP_ELEMENT,
} from '@googleforcreators/design-system';
import { useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { MIN_MAX } from '../../panels/design/sizePosition/opacity';
import {
  FocusTrapButton,
  handleReturnTrappedFocus,
  useProperties,
} from './shared';

const Input = styled(NumericInput)`
  width: 82px;
  flex: 0 0 82px;
`;

const OPACITY_LABEL = __('Opacity in percent', 'web-stories');

function LayerOpacity() {
  const inputRef = useRef();
  const buttonRef = useRef();
  const { opacity, type } = useProperties(['opacity', 'type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const handleOpacityChange = (_, value) => {
    updateSelectedElements({
      properties: () => ({
        opacity: value ?? 100,
      }),
    });

    trackEvent('floating_menu', {
      name: 'set_opacity',
      element: type,
    });
  };

  return (
    <FocusTrapButton
      ref={buttonRef}
      inputRef={inputRef}
      inputLabel={OPACITY_LABEL}
    >
      <Input
        ref={inputRef}
        tabIndex={-1}
        suffix={<Icons.ColorDrop />}
        unit={_x('%', 'Percentage', 'web-stories')}
        value={opacity || 0}
        aria-label={OPACITY_LABEL}
        onChange={handleOpacityChange}
        inputClassName={CONTEXT_MENU_SKIP_ELEMENT}
        onKeyDown={(e) => {
          handleReturnTrappedFocus(e, buttonRef);
        }}
        min={MIN_MAX.OPACITY.MIN}
        max={MIN_MAX.OPACITY.MAX}
      />
    </FocusTrapButton>
  );
}

export default LayerOpacity;
