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
import {
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from '@googleforcreators/react';
import { useFeature, useFeatures } from 'flagged';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import useMedia from '../../../../../app/media/useMedia';
import {
  PaneHeader,
  PaneInner,
  SearchInputContainer,
  StyledPane,
} from '../common/styles';
import { SearchInput } from '../../../common';
import { PROVIDERS } from '../../../../../app/media/media3p/providerConfiguration';
import TermsDialog from './termsDialog';

import paneId from './paneId';
import ProviderTabList from './providerTabList';
import ProviderPanel from './providerPanel';

const PaneBottom = styled.div`
  position: relative;
  height: 100%;
  flex: 1 1 auto;
  min-height: 0;
`;

/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  const { isActive } = props;

  const {
    searchTerm,
    selectedProvider,
    setSelectedProvider,
    setSearchTerm,
    media3p,
  } = useMedia(
    ({
      media3p: {
        state: { selectedProvider, searchTerm },
        actions: { setSelectedProvider, setSearchTerm },
      },
      media3p,
    }) => ({
      searchTerm,
      selectedProvider,
      setSelectedProvider,
      setSearchTerm,
      media3p,
    })
  );

  useEffect(() => {
    if (isActive && !selectedProvider) {
      setSelectedProvider({ provider: Object.keys(PROVIDERS)[0] });
    }
  }, [isActive, selectedProvider, setSelectedProvider]);

  const selectedCategoryId =
    media3p[selectedProvider]?.state?.categories?.selectedCategoryId;

  useEffect(() => {
    if (searchTerm.length) {
      trackEvent('search', {
        search_type: 'media3p',
        search_term: searchTerm,
        search_filter: selectedProvider,
        search_category: selectedCategoryId,
      });
    }
  }, [selectedProvider, searchTerm, selectedCategoryId]);

  const onSearch = useCallback(
    (value) => {
      const trimText = value.trim();
      if (trimText !== searchTerm) {
        setSearchTerm({ searchTerm: trimText });
      }
    },
    [searchTerm, setSearchTerm]
  );

  const paneBottomRef = useRef();

  const features = useFeatures();
  const providers = useMemo(
    () =>
      Object.keys(PROVIDERS).filter(
        (p) => !PROVIDERS[p].featureName || features[PROVIDERS[p].featureName]
      ),
    [features]
  );

  // TODO(#2368): handle pagination / infinite scrolling
  return (
    <>
      {isActive && <TermsDialog />}
      <StyledPane id={paneId} {...props}>
        <PaneInner>
          <PaneHeader>
            <SearchInputContainer>
              <SearchInput
                initialValue={searchTerm}
                placeholder={__('Search', 'web-stories')}
                onSearch={onSearch}
                disabled={Boolean(
                  selectedProvider &&
                    PROVIDERS[selectedProvider].supportsCategories &&
                    media3p[selectedProvider]?.state.categories
                      .selectedCategoryId
                )}
              />
            </SearchInputContainer>
            <ProviderTabList providers={providers} />
          </PaneHeader>
          <PaneBottom ref={paneBottomRef}>
            {providers.map((providerType) => (
              <ProviderPanel
                key={providerType}
                providerType={providerType}
                isActive={providerType === selectedProvider}
                searchTerm={searchTerm}
                role="tabpanel"
                aria-labelledby={`provider-tab-${providerType}`}
                id={`provider-tabpanel-${providerType}`}
              />
            ))}
          </PaneBottom>
        </PaneInner>
      </StyledPane>
    </>
  );
}

Media3pPane.propTypes = {
  isActive: PropTypes.bool,
};

export default Media3pPane;
