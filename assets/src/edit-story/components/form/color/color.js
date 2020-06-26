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
import { useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../../types';
import applyOpacityChange from './applyOpacityChange';
import ColorPreview from './colorPreview';
import OpacityPreview from './opacityPreview';

const Container = styled.section`
  display: flex;
  align-items: center;
`;

function ColorInput({
  onChange,
  hasGradient,
  hasOpacity,
  value,
  label,
  colorPickerActions,
}) {
  const handleOpacityChange = useCallback(
    (newOpacity) => onChange(applyOpacityChange(value, newOpacity)),
    [value, onChange]
  );

  // translators: The thing that can be colored
  const containerLabel = sprintf(__('Color input: %s', 'web-stories'), label);

  return (
    <Container aria-label={containerLabel}>
      <ColorPreview
        onChange={onChange}
        hasGradient={hasGradient}
        hasOpacity={hasOpacity}
        value={value}
        label={label}
        colorPickerActions={colorPickerActions}
      />
      {hasOpacity && (
        <OpacityPreview value={value} onChange={handleOpacityChange} />
      )}
    </Container>
  );
}

ColorInput.propTypes = {
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  colorPickerActions: PropTypes.func,
};

ColorInput.defaultProps = {
  value: null,
  hasGradient: false,
  hasOpacity: true,
  opacity: null,
};

export default ColorInput;
