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
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from '@googleforcreators/react';
import { _x, __ } from '@googleforcreators/i18n';
import { getTimeTracker, trackEvent } from '@googleforcreators/tracking';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Text,
  Headline,
  LoadingSpinner,
  TextSize,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { ChipGroup, LoadingContainer, PANE_PADDING } from '../shared';
import { SearchInput } from '../../common';
import { virtualPaneContainer } from '../shared/virtualizedPanelGrid';
import { PAGE_TEMPLATE_TYPES } from './constants';
import TemplateList from './templateList';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 16px 22px 16px;
`;

const PageTemplatesParentContainer = styled.div`
  ${virtualPaneContainer};
  margin-top: 26px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const SearchInputContainer = styled.div`
  padding: 0 ${PANE_PADDING};
  margin-bottom: 26px;
`;

const Message = styled(Text.Paragraph).attrs({
  size: TextSize.Medium,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 1em;
  text-align: center;
`;

function DefaultTemplates({ pageSize }) {
  const {
    actions: { getPageTemplates },
  } = useAPI();
  const [pageTemplates, setPageTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // load and process pageTemplates
  useEffect(() => {
    async function loadPageTemplates() {
      setIsLoading(true);
      const trackTiming = getTimeTracker('load_page_templates');
      setPageTemplates(await getPageTemplates(searchTerm));
      setIsLoading(false);
      trackTiming();
    }

    loadPageTemplates();
  }, [getPageTemplates, setPageTemplates, searchTerm]);

  const pageTemplatesParentRef = useRef();
  const [selectedPageTemplateType, setSelectedPageTemplateType] =
    useState(null);

  const pills = useMemo(
    () => [
      { id: null, label: _x('All', 'page templates', 'web-stories') },
      ...Object.entries(PAGE_TEMPLATE_TYPES).map(([key, { name }]) => ({
        id: key,
        label: name,
      })),
    ],
    []
  );

  const filteredPages = useMemo(
    () =>
      pageTemplates.reduce((pages, template) => {
        const templatePosters = Object.values(template.postersByPage).map(
          (poster, index) => {
            return {
              id: `${template.slug}_${index}`,
              title: template.title,
              story: template.pages[index],
              ...poster,
            };
          }
        );

        const templatePages = templatePosters.reduce((acc, posterByPage) => {
          // skip unselected page template types if not matching
          if (
            !posterByPage.type ||
            (selectedPageTemplateType &&
              posterByPage.type !== selectedPageTemplateType)
          ) {
            return acc;
          }

          return [...acc, posterByPage];
        }, []);

        return [...pages, ...templatePages];
      }, []),
    [pageTemplates, selectedPageTemplateType]
  );

  const handleSelectPageTemplateType = useCallback((key) => {
    setSelectedPageTemplateType(key);
    trackEvent('search', {
      search_type: 'page_templates',
      search_term: '',
      search_category: key,
    });
  }, []);

  return (
    <>
      <SearchInputContainer>
        <SearchInput
          initialValue={searchTerm}
          placeholder={__('Search', 'web-stories')}
          onSearch={setSearchTerm}
          disabled={false}
        />
      </SearchInputContainer>
      <ChipGroup
        items={pills}
        selectedItemId={selectedPageTemplateType}
        selectItem={handleSelectPageTemplateType}
        deselectItem={() => handleSelectPageTemplateType(null)}
      />
      {/* tabIndex is required for FireFox bug when using keyboard to navigate from Chips to Template */}
      <PageTemplatesParentContainer ref={pageTemplatesParentRef} tabIndex={-1}>
        <ActionRow>
          <Headline as="h2" size={TextSize.XXXSmall}>
            {__('Templates', 'web-stories')}
          </Headline>
        </ActionRow>

        {isLoading || !pageTemplatesParentRef.current ? (
          <LoadingContainer>
            <LoadingSpinner animationSize={64} numCircles={8} />
          </LoadingContainer>
        ) : pageTemplates.length === 0 ? (
          <Message>{__('No page templates found.', 'web-stories')}</Message>
        ) : (
          <TemplateList
            pageSize={pageSize}
            parentRef={pageTemplatesParentRef}
            pages={filteredPages}
          />
        )}
      </PageTemplatesParentContainer>
    </>
  );
}

DefaultTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
};

export default DefaultTemplates;
