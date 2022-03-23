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
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import { canSupportMultiBorder } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { DEFAULT_BORDER } from '../../panels/design/border/shared';
import { Input, Color, useProperties } from './shared';

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

function BorderWidthAndColor() {
  // Note that "mask" never updates on an element,
  // so selecting it cannot cause re-renders
  // We need it to determine if border opacity is allowed.
  const {
    border = DEFAULT_BORDER,
    mask,
    type,
  } = useProperties(['border', 'mask', 'type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  // Only multi-border elements support border opacity
  const canHaveBorderOpacity = canSupportMultiBorder({ mask });

  // We only allow editing the current border width, if all borders are identical
  const hasUniformBorder =
    border.left === border.right &&
    border.left === border.top &&
    border.left === border.bottom;

  // We only allow editing border color, if at least one border has a non-zero width
  const hasBorderWidth = getHasBorderWidth(border);

  // If both controls are displayed, also add a dash between them
  const hasBoth = hasUniformBorder && hasBorderWidth;

  // NB: Note that it can never be the case, that both of the above bools, hasUniformBorder
  // and hasBorderWidth, are false. If so, neither input would be shown. But because they
  // partially contradict each other, one of the inputs will always render.

  const handleWidthChange = (value) => {
    trackEvent('floating_menu', {
      name: 'set_border_width',
      element: type,
    });

    updateSelectedElements({
      properties: ({ border: oldBorder }) => ({
        border: {
          locked: true,
          color: border.color,
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
    trackEvent('floating_menu', {
      name: 'set_border_color',
      element: type,
    });

    updateSelectedElements({
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
      {hasUniformBorder && (
        <Input
          suffix={<Icons.BorderBox />}
          value={border.left || 0}
          aria-label={__('Border width', 'web-stories')}
          onChange={(_, value) => handleWidthChange(value)}
        />
      )}
      {hasBoth && <Dash />}
      {hasBorderWidth && (
        <Color
          label={__('Border color', 'web-stories')}
          value={border.color || BLACK}
          onChange={handleColorChange}
          hasInputs={false}
          hasEyedropper={false}
          allowsOpacity={canHaveBorderOpacity}
          allowsGradient={false}
          pickerHasEyedropper={false} // override shared floating menu Color component TODO https://github.com/GoogleForCreators/web-stories-wp/issues/11024
          allowsSavedColors={false}
        />
      )}
    </Container>
  );
}

export default BorderWidthAndColor;
