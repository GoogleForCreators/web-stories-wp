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
import {
  useCallback,
  useRef,
  useState,
  useEffect,
} from '@googleforcreators/react';
import styled from 'styled-components';
import { useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useMedia from '../../../../../app/media/useMedia';
import { useConfig } from '../../../../../app/config';
import { PROVIDERS } from '../../../../../app/media/media3p/providerConfiguration';
import ProviderTab from './providerTab';

const Section = styled.div.attrs({ role: 'tablist' })`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  margin-bottom: 16px;
  padding: 0 1em;
`;

function ProviderTabList({ providers }) {
  const { isRTL } = useConfig();
  const ref = useRef();

  const { selectedProvider, setSelectedProvider } = useMedia(
    ({
      media3p: {
        state: { selectedProvider },
        actions: { setSelectedProvider },
      },
    }) => ({
      selectedProvider,
      setSelectedProvider,
    })
  );

  const [focusedIndex, setFocusedIndex] = useState(0);

  const providerCount = providers.length;

  // Whenever selected provider changes, update focused index to that
  useEffect(
    () => setFocusedIndex(providers.indexOf(selectedProvider)),
    [providers, selectedProvider]
  );

  const focusByIndex = useCallback((newIndex) => {
    if (!ref.current) {
      return;
    }
    const container = ref.current;
    const newFocusedTab = container.children[newIndex];
    newFocusedTab.focus();
  }, []);

  const selectFocused = useCallback(
    () => setSelectedProvider({ provider: providers[focusedIndex] }),
    [focusedIndex, setSelectedProvider, providers]
  );

  const dir = isRTL ? -1 : 1;

  useKeyDownEffect(
    ref,
    'left',
    () => focusByIndex((focusedIndex - dir + providerCount) % providerCount),
    [focusByIndex, focusedIndex, dir, providerCount]
  );

  useKeyDownEffect(
    ref,
    'right',
    () => focusByIndex((focusedIndex + dir + providerCount) % providerCount),
    [focusByIndex, focusedIndex, dir, providerCount]
  );

  useKeyDownEffect(ref, 'home', () => focusByIndex(0), [focusByIndex]);

  useKeyDownEffect(ref, 'end', () => focusByIndex(providerCount - 1), [
    focusByIndex,
    providerCount,
  ]);

  useKeyDownEffect(ref, ['enter', 'space'], selectFocused, [selectFocused]);

  return (
    <Section ref={ref}>
      {providers.map((providerType, index) => (
        <ProviderTab
          key={providerType}
          index={index}
          name={PROVIDERS[providerType].displayName}
          isActive={selectedProvider === providerType}
          onClick={() => setSelectedProvider({ provider: providerType })}
          onFocus={() => setFocusedIndex(index)}
          tabIndex={selectedProvider === providerType ? 0 : -1}
          role="tab"
          id={`provider-tab-${providerType}`}
          aria-controls={`provider-tabpanel-${providerType}`}
        />
      ))}
    </Section>
  );
}

ProviderTabList.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProviderTabList;
