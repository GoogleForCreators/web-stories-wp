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
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../../../../../design-system';
import { useConfig } from '../../../../../app/config';
import { narrowPill } from './pill';

const Tab = styled.button`
  ${narrowPill};
  padding: 6px 16px;
  height: 32px;
  display: inline-block;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.family};
  background-color: ${({ active, theme }) =>
    active ? theme.DEPRECATED_THEME.colors.fg.primary : 'transparent'};
  text-align: center;
  opacity: 0.86;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ active, theme }) =>
    active
      ? theme.DEPRECATED_THEME.colors.fg.gray8
      : theme.DEPRECATED_THEME.colors.fg.primary};

  &:last-child {
    margin-right: 0;
  }
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
      active={active}
      id={id}
    >
      {name}
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
