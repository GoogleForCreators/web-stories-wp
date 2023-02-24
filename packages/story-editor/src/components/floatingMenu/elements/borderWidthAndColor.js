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
import { Icons } from '@googleforcreators/design-system';
import { useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import { canSupportMultiBorder } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { DEFAULT_BORDER } from '../../panels/design/border/shared';
import {
  Input,
  Color,
  useProperties,
  FocusTrapButton,
  handleReturnTrappedFocus,
} from './shared';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Dash = styled.div`
  width: 8px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border.defaultNormal};
`;

function getHasBorderWidth(border) {
  if (!border) {
    return false;
  }
  const { left, right, top, bottom } = border;
  return Boolean(left || right || top || bottom);
}

const BLACK = { color: { r: 0, g: 0, b: 0 } };

const WIDTH_LABEL = __('Border width', 'web-stories');
const COLOR_LABEL = __('Border color', 'web-stories');

function BorderWidthAndColor() {
  const inputRef = useRef();
  const buttonRef = useRef();
  // Note that "mask" never updates on an element,
  // so selecting it cannot cause re-renders
  // We need it to determine if border opacity is allowed.
  const {
    border = DEFAULT_BORDER,
    mask,
    type,
  } = useProperties(['border', 'mask', 'type']);

  const { selectedElementIds, updateElementsById } = useStory(
    ({ state, actions }) => ({
      selectedElementIds: state.selectedElementIds,
      updateElementsById: actions.updateElementsById,
    })
  );

  // We only allow editing the current border width, if all borders are identical
  const hasUniformBorder =
    border?.left === border?.right &&
    border?.left === border?.top &&
    border?.left === border?.bottom;

  // Border width and color inputs should only be rendered if all sides of the border are the same.
  // Both checks are needed since not all shaped have lockedWidth eg. circles.
  if (!border?.lockedWidth && !hasUniformBorder) {
    return null;
  }

  // Only multi-border elements support border opacity
  const canHaveBorderOpacity = canSupportMultiBorder({ mask });

  // We only allow editing border color, if at least one border has a non-zero width
  const hasBorderWidth = getHasBorderWidth(border);

  const handleWidthChange = (value) => {
    void trackEvent('floating_menu', {
      name: 'set_border_width',
      element: type,
    });

    updateElementsById({
      elementIds: selectedElementIds,
      properties: ({ border: oldBorder }) => ({
        border: {
          locked: true,
          color: border?.color,
          ...oldBorder,
          left: value,
          right: value,
          top: value,
          bottom: value,
        },
      }),
    });
  };

  const handleColorChange = (value) => {
    void trackEvent('floating_menu', {
      name: 'set_border_color',
      element: type,
    });

    updateElementsById({
      elementIds: selectedElementIds,
      properties: ({ border: oldBorder }) => ({
        border: {
          ...oldBorder,
          color: value,
        },
      }),
    });
  };

  return (
    <Container>
      <FocusTrapButton
        ref={buttonRef}
        inputRef={inputRef}
        inputLabel={WIDTH_LABEL}
      >
        <Input
          tabIndex={-1}
          ref={inputRef}
          suffix={<Icons.BorderBox />}
          value={border?.left || 0}
          aria-label={WIDTH_LABEL}
          onChange={(_, value) => handleWidthChange(value)}
          onKeyDown={(e) => {
            handleReturnTrappedFocus(e, buttonRef);
          }}
        />
      </FocusTrapButton>
      {hasBorderWidth && (
        <>
          <Dash />
          <Color
            tabIndex={-1}
            label={COLOR_LABEL}
            value={border?.color || BLACK}
            onChange={handleColorChange}
            hasInputs={false}
            hasEyedropper={false}
            allowsOpacity={canHaveBorderOpacity}
            allowsGradient={false}
            allowsSavedColors={false}
          />
        </>
      )}
    </Container>
  );
}

export default BorderWidthAndColor;
