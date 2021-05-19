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
import { forwardRef, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../../types';
import { MULTIPLE_VALUE } from '../../../constants';
import getPreviewText from '../../../../design-system/components/hex/getPreviewText';
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

// 10px comes from divider
const InputWrapper = styled.div`
  width: calc(50% - 10px);
`;

const Color = forwardRef(function Color(
  {
    onChange,
    hasGradient,
    hasOpacity,
    value,
    label,
    colorPickerActions,
    changedStyle,
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

  return (
    <Container aria-label={containerLabel}>
      <InputWrapper>
        <ColorInput
          ref={ref}
          onChange={onChange}
          hasGradient={hasGradient}
          hasOpacity={hasOpacity}
          value={value}
          label={label}
          colorPickerActions={colorPickerActions}
          changedStyle={changedStyle}
        />
      </InputWrapper>
      {hasOpacity && displayOpacity && (
        <>
          <Space />
          <InputWrapper>
            <OpacityInput value={value} onChange={handleOpacityChange} />
          </InputWrapper>
        </>
      )}
    </Container>
  );
});

Color.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  colorPickerActions: PropTypes.func,
  changedStyle: PropTypes.string,
};

Color.defaultProps = {
  value: null,
  hasGradient: false,
  hasOpacity: true,
  opacity: null,
};

export default Color;
