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
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { _x, sprintf, __ } from '@web-stories-wp/i18n';
import { getTimeTracker, trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { Pane, ChipGroup } from '../shared';
import { virtualPaneContainer } from '../shared/virtualizedPanelGrid';
import paneId from './paneId';
import PageTemplates from './pageTemplates';
import { PAGE_TEMPLATE_TYPES } from './constants';

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const PaneInner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const PageTemplatesParentContainer = styled.div`
  ${virtualPaneContainer};
  margin-top: 18px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

function PageTemplatesPane(props) {
  const {
    actions: { getPageTemplates },
  } = useAPI();
  const [pageTemplates, setPageTemplates] = useState([]);
  const [selectedPageTemplateType, setSelectedPageTemplateType] = useState(
    null
  );
  const [showTemplateImages, setShowTemplateImages] = useState(false);

  const pageTemplatesParentRef = useRef();

  // load and process pageTemplates
  useEffect(() => {
    async function loadPageTemplates() {
      const trackTiming = getTimeTracker('load_page_templates');
      setPageTemplates(
        await getPageTemplates({ showImages: showTemplateImages })
      );
      trackTiming();
    }

    loadPageTemplates();
  }, [getPageTemplates, showTemplateImages, setPageTemplates]);

  const pills = useMemo(
    () => [
      { id: null, label: __('All', 'web-stories') },
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
        const templatePages = template.pages.reduce((acc, page) => {
          // skip unselected page template types if not matching
          if (
            !page.pageTemplateType ||
            (selectedPageTemplateType &&
              page.pageTemplateType !== selectedPageTemplateType)
          ) {
            return acc;
          }

          const pageTemplateName =
            PAGE_TEMPLATE_TYPES[page.pageTemplateType].name;
          return [
            ...acc,
            {
              ...page,
              title: sprintf(
                /* translators: 1: template name. 2: page template name. */
                _x('%1$s %2$s', 'page template title', 'web-stories'),
                template.title,
                pageTemplateName
              ),
            },
          ];
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

  const handleToggleClick = useCallback(() => {
    setShowTemplateImages((currentValue) => !currentValue);
  }, []);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <ChipGroup
          items={pills}
          selectedItemId={selectedPageTemplateType}
          selectItem={handleSelectPageTemplateType}
          deselectItem={() => handleSelectPageTemplateType(null)}
        />
        <PageTemplatesParentContainer ref={pageTemplatesParentRef}>
          {pageTemplatesParentRef.current && (
            <PageTemplates
              onToggleClick={handleToggleClick}
              parentRef={pageTemplatesParentRef}
              pages={filteredPages}
              showImages={showTemplateImages}
            />
          )}
        </PageTemplatesParentContainer>
      </PaneInner>
    </StyledPane>
  );
}

export default PageTemplatesPane;
