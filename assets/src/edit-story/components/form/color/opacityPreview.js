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

/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../../types';
import getPreviewText from './getPreviewText';
import getPreviewOpacity from './getPreviewOpacity';
import ColorBox from './colorBox';

const PreviewBox = styled(ColorBox).attrs({
  role: 'textbox',
})`
  margin-left: 6px;
  width: 54px;
  line-height: 32px;
  text-align: center;
  cursor: ew-resize;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`;

function OpacityPreview({ opacity, value }) {
  const hasPreviewText = Boolean(getPreviewText(value));
  const previewOpacity = getPreviewOpacity(value, opacity);

  return (
    <PreviewBox isVisible={hasPreviewText}>
      {previewOpacity}
      {_x('%', 'Percentage', 'web-stories')}
    </PreviewBox>
  );
}

OpacityPreview.propTypes = {
  value: PatternPropType,
  opacity: PropTypes.number,
};

export default OpacityPreview;
