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
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import { ReactComponent as CloseIcon } from '../../icons/close.svg';

import {
  PillLabel,
  ACTIVE_CHOICE_LEFT_MARGIN,
  ACTIVE_CHOICE_ICON_SIZE,
} from './components';

const ActiveChoiceIcon = styled(CloseIcon)`
  background-color: ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.blueLight};
  border-radius: 50%;
  padding: 3px;
  margin-left: ${ACTIVE_CHOICE_LEFT_MARGIN}px;
`;

const DefaultPill = ({ children, isSelected = false }) => {
  return (
    <PillLabel isSelected={isSelected} ariaHidden={true}>
      {children}
      {isSelected && (
        <ActiveChoiceIcon
          width={ACTIVE_CHOICE_ICON_SIZE}
          height={ACTIVE_CHOICE_ICON_SIZE}
        />
      )}
    </PillLabel>
  );
};

DefaultPill.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
};

export default DefaultPill;
