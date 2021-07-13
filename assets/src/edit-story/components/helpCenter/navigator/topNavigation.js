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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Headline,
  Icons,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { forceFocusCompanionToggle } from '../utils';
import { NavBar, NavButton } from './components';

const TopNavButtons = styled.div`
  padding-right: 15px;
`;

const Label = styled(Headline).attrs({
  as: 'h2',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
})`
  padding-left: 24px;
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;

export function TopNavigation({ onClose, label, popupId }) {
  return (
    <NavBar>
      <Label>{label}</Label>
      <TopNavButtons>
        <NavButton
          aria-label={__('Close', 'web-stories')}
          onClick={() => {
            forceFocusCompanionToggle(popupId);
            onClose();
          }}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.CIRCLE}
        >
          <Icons.Cross />
        </NavButton>
      </TopNavButtons>
    </NavBar>
  );
}

TopNavigation.propTypes = {
  onClose: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  popupId: PropTypes.string.isRequired,
};
