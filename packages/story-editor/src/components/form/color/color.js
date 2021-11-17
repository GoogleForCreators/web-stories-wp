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
import styled, { css } from 'styled-components';
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
import applyOpacityChange from './applyOpacityChange';
import OpacityInput from './opacityInput';
import ColorInput from './colorInput';

const containerCss = css`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Container = styled.section`
  ${containerCss}
`;

const ColorInputsWrapper = styled.div`
  ${containerCss}
`;

const Space = styled.div`
  width: 8px;
  height: 1px;
  margin: 6px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;

// 10px comes from divider / 2
const InputWrapper = styled.div`
  width: calc(53% - 10px);
`;

const OpacityWrapper = styled.div`
  width: calc(47% - 10px);
`;

const EyeDropperButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  margin-right: 8px;
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

  return (
    <Container aria-label={containerLabel}>
      {hasEyedropper && (
        <Tooltip title={tooltip} hasTail>
          <EyeDropperButton
            aria-label={tooltip}
            onClick={initEyedropper()}
            onPointerEnter={initEyedropper(false)}
          >
            <Icons.Pipette />
          </EyeDropperButton>
        </Tooltip>
      )}

      <ColorInputsWrapper>
        <InputWrapper>
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
            <OpacityWrapper>
              <OpacityInput value={value} onChange={handleOpacityChange} />
            </OpacityWrapper>
          </>
        )}
      </ColorInputsWrapper>
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
