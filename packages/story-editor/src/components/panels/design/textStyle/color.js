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
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@web-stories-wp/design-system';
import Tooltip from '../../../tooltip';
import { Color, Row } from '../../../form';
import useApplyTextAutoStyle from '../../../../utils/useApplyTextAutoStyle';
import useRichTextFormatting from './useRichTextFormatting';

const AutoStyleButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  margin-right: 4px;
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(theme.colors.border.focus, '#1d1f20')};
`;

function ColorControls({ selectedElements, pushUpdate, textColorRef }) {
  const {
    textInfo: { color },
    handlers: { handleSetColor },
  } = useRichTextFormatting(selectedElements, pushUpdate);

  const applyTextAutoStyle = useApplyTextAutoStyle(
    selectedElements[0],
    (props) => {
      pushUpdate(props, true);
      trackEvent('auto_style_text');
    }
  );

  return (
    <Row>
      <Tooltip title={__('Adaptive text colors', 'web-stories')}>
        <AutoStyleButton
          aria-label={__('Adaptive text colors', 'web-stories')}
          onClick={applyTextAutoStyle}
          disabled={selectedElements?.length > 1}
        >
          <Icons.ColorBucket />
        </AutoStyleButton>
      </Tooltip>
      <Color
        data-testid="text.color"
        value={color}
        onChange={handleSetColor}
        allowsSavedColors
        label={__('Text color', 'web-stories')}
        labelId="text-color-label"
        changedStyle="color"
        ref={textColorRef}
      />
    </Row>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
  textColorRef: PropTypes.func,
};

export default ColorControls;
