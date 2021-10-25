/*
 * Copyright 2020 Google LLC
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
import { forwardRef, useCallback } from '@web-stories-wp/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, sprintf } from '@web-stories-wp/i18n';
import { getPreviewText, PatternPropType } from '@web-stories-wp/patterns';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../constants';
import useEyedropper from '../../eyedropper';
import Tooltip from '../../tooltip';
import { focusStyle } from '../../panels/shared';
import { OverlayType } from '../../../utils/overlay';
import applyOpacityChange from './applyOpacityChange';
import OpacityInput from './opacityInput';
import ColorInput from './colorInput';

const Container = styled.section`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Space = styled.div`
  width: 8px;
  height: 1px;
  margin: 6px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;

// color input requires 106px of minimum width to display hex value (try: #000000)
// 10px comes from divider / 2
const inputSize = 106;
const InputWrapper = styled.div`
  ${({ isEyedropper }) =>
    isEyedropper
      ? `
      flex-grow: 1;
      flex-basis: ${inputSize}px;
      `
      : 'flex-basis: calc(50% - 10px);'}
`;

// 20px & 10px comes from divider & divider / 2
const OpacityWrapper = styled.div`
  flex-basis: ${({ isEyedropper }) =>
    isEyedropper ? `calc(100% - ${inputSize}px - 20px);` : 'calc(50% - 10px);'};
`;

const EyeDropperButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  margin-right: 4px;
  ${focusStyle};
`;

const Color = forwardRef(function Color(
  {
    onChange,
    allowsGradient = false,
    allowsOpacity = true,
    allowsSavedColors = false,
    value = null,
    label = null,
    changedStyle = null,
    hasEyedropper = false,
  },
  ref
) {
  const handleOpacityChange = useCallback(
    (newOpacity) => onChange(applyOpacityChange(value, newOpacity)),
    [value, onChange]
  );

  const containerLabel = sprintf(
    /* translators: %s: color input label name. */
    __('Color input: %s', 'web-stories'),
    label
  );

  const displayOpacity =
    value !== MULTIPLE_VALUE && Boolean(getPreviewText(value));

  const { initEyedropper } = useEyedropper({
    onChange: (color) => onChange({ color }),
  });
  const tooltip = __('Pick a color from canvas', 'web-stories');

  // Enable eyedropper only for solid colors
  // https://github.com/google/web-stories-wp/pull/9488#issuecomment-950679465
  const shouldShowEyedropper =
    hasEyedropper &&
    value.type !== OverlayType.RADIAL &&
    value.type !== OverlayType.LINEAR;

  const withEyedropper = (children) => {
    if (shouldShowEyedropper) {
      return (
        <Container>
          <Tooltip title={tooltip} hasTail>
            <EyeDropperButton
              aria-label={tooltip}
              onClick={initEyedropper()}
              onPointerEnter={initEyedropper(false)}
            >
              <Icons.Pipette />
            </EyeDropperButton>
          </Tooltip>
          {children}
        </Container>
      );
    }

    return children;
  };

  return withEyedropper(
    <Container aria-label={containerLabel}>
      <InputWrapper isEyedropper={shouldShowEyedropper}>
        <ColorInput
          ref={ref}
          onChange={onChange}
          allowsGradient={allowsGradient}
          allowsOpacity={allowsOpacity}
          value={value}
          label={label}
          allowsSavedColors={allowsSavedColors}
          changedStyle={changedStyle}
        />
      </InputWrapper>
      {allowsOpacity && displayOpacity && (
        <>
          <Space />
          <OpacityWrapper isEyedropper={shouldShowEyedropper}>
            <OpacityInput value={value} onChange={handleOpacityChange} />
          </OpacityWrapper>
        </>
      )}
    </Container>
  );
});

Color.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  allowsGradient: PropTypes.bool,
  allowsOpacity: PropTypes.bool,
  allowsSavedColors: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  changedStyle: PropTypes.string,
  hasEyedropper: PropTypes.bool,
};

export default Color;
