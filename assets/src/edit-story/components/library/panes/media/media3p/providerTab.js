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
import { useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  useKeyDownEffect,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { useConfig } from '../../../../../app/config';
import { focusStyle } from '../../../../panels/shared';

const StyledText = styled(Text)`
  color: inherit;
`;

const Tab = styled.button`
  padding: 6px 16px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.fg.secondary};
  position: relative;
  cursor: pointer;

  :hover {
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  border-radius: ${({ theme }) => theme.borders.radius.x_large};
  ${focusStyle};

  ${({ isActive, theme }) =>
    isActive &&
    css`
      ::after {
        content: '';
        position: absolute;
        background-color: ${theme.colors.border.selection};
        height: 2px;
        border-radius: 1px;
        bottom: -17px;
        left: 16px;
        right: 16px;
      }
    `}
`;

function ProviderTab({
  id,
  index,
  name,
  providerType,
  active,
  setSelectedProvider,
}) {
  const { isRTL } = useConfig();
  const ref = useRef();

  const onKeyDown = useCallback(
    ({ key }) => {
      if (!ref.current) {
        return;
      }
      ref.current.tabIndex = -1;
      const siblingSelector =
        (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL)
          ? 'nextSibling'
          : 'previousSibling';
      const sibling = ref.current[siblingSelector];
      if (sibling) {
        sibling.tabIndex = 0;
        sibling.focus();
        const newProvider = sibling.dataset.providerType;
        setSelectedProvider({ provider: newProvider });
      }
    },
    [ref, isRTL, setSelectedProvider]
  );

  useKeyDownEffect(
    ref,
    {
      key: ['left', 'right'],
    },
    onKeyDown,
    [ref, onKeyDown]
  );

  return (
    <Tab
      ref={ref}
      tabIndex={index == 0 ? 0 : -1}
      data-testid={'providerTab'}
      onClick={() => setSelectedProvider({ provider: providerType })}
      data-provider-type={providerType}
      isActive={active}
      id={id}
    >
      <StyledText
        forwardedAs="span"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {name}
      </StyledText>
    </Tab>
  );
}

ProviderTab.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  providerType: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  setSelectedProvider: PropTypes.func.isRequired,
};

export default ProviderTab;
