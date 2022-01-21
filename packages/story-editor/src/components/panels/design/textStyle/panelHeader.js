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
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@googleforcreators/design-system';
import { useContext } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import useApplyTextAutoStyle from '../../../../utils/useApplyTextAutoStyle';
import Tooltip from '../../../tooltip';
import PanelTitle from '../../panel/shared/title';
import panelContext from '../../panel/context';

const AutoStyleButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(theme.colors.border.focus, '#1d1f20')};
`;

function PanelHeader({ selectedElements, pushUpdate }) {
  const {
    state: { isCollapsed },
  } = useContext(panelContext);
  const applyTextAutoStyle = useApplyTextAutoStyle(
    selectedElements[0],
    (textProps) => {
      pushUpdate(textProps, true);
      trackEvent('auto_style_text');
    }
  );

  const getActions = () => {
    if (isCollapsed) {
      return null;
    }
    return (
      <Tooltip title={__('Adaptive text colors', 'web-stories')}>
        <AutoStyleButton
          aria-label={__('Adaptive text colors', 'web-stories')}
          onClick={applyTextAutoStyle}
          disabled={selectedElements?.length > 1}
        >
          <Icons.ColorBucket />
        </AutoStyleButton>
      </Tooltip>
    );
  };
  const panelTitle = __('Text', 'web-stories');
  return (
    <PanelTitle ariaLabel={panelTitle} secondaryAction={getActions()}>
      {panelTitle}
    </PanelTitle>
  );
}

PanelHeader.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default PanelHeader;
