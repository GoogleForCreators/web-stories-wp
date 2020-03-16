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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef, useCallback, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../../types';
import { useSidebar } from '../../sidebar';
import getPreviewText from './getPreviewText';
import getPreviewStyle from './getPreviewStyle';
import ColorBox from './colorBox';

const Preview = styled(ColorBox).attrs({
  as: 'button',
})`
  display: flex;
  width: 122px;
  cursor: pointer;
  padding: 0;
  border: 0;
`;

const VisualPreview = styled.div`
  width: 32px;
  height: 32px;
`;

const TextualPreview = styled.div`
  padding-left: 10px;
  text-align: center;
`;

function ColorPreview({
  onChange,
  hasGradient,
  hasOpacity,
  isMultiple,
  value,
  label,
}) {
  const previewStyle = getPreviewStyle(isMultiple ? null : value);
  const previewText = getPreviewText(value);
  const fullLabel = `${label}: ${previewText}`;

  const {
    actions: { showColorPickerAt, hideSidebar },
  } = useSidebar();

  const ref = useRef();

  const handleOpenEditing = useCallback(() => {
    showColorPickerAt(ref.current, {
      color: value,
      onChange,
      hasGradient,
      hasOpacity,
      onClose: hideSidebar,
    });
  }, [
    showColorPickerAt,
    hideSidebar,
    value,
    onChange,
    hasGradient,
    hasOpacity,
  ]);

  // Always hide color picker on unmount - note the double arrows
  useEffect(() => () => hideSidebar(), [hideSidebar]);

  return (
    <Preview ref={ref} onClick={handleOpenEditing} aria-label={fullLabel}>
      <VisualPreview role="status" style={previewStyle} />
      <TextualPreview>
        {isMultiple
          ? __('Multiple', 'web-stories')
          : previewText ||
            _x('None', 'No color or gradient selected', 'web-stories')}
      </TextualPreview>
    </Preview>
  );
}

ColorPreview.propTypes = {
  value: PatternPropType,
  isMultiple: PropTypes.bool,
  hasGradient: PropTypes.bool,
  hasOpacity: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

ColorPreview.defaultProps = {
  isMultiple: false,
  hasGradient: false,
  hasOpacity: true,
  label: null,
};

export default ColorPreview;
