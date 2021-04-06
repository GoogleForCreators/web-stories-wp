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
import { _x, sprintf } from '@web-stories-wp/i18n';
import { getTimeTracker, trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { Pane, PillGroup } from '../shared';
import { virtualPaneContainer } from '../shared/virtualizedPanelGrid';
import paneId from './paneId';
import PageLayouts from './pageLayouts';
import { PAGE_LAYOUT_TYPES } from './constants';

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

export const PageLayoutsParentContainer = styled.div`
  ${virtualPaneContainer}
  overflow-x: hidden;
  overflow-y: scroll;
`;

function PageLayoutsPane(props) {
  const {
    actions: { getPageLayouts },
  } = useAPI();
  const [pageLayouts, setPageLayouts] = useState([]);
  const [selectedPageLayoutType, setSelectedPageLayoutType] = useState(null);

  const pageLayoutsParentRef = useRef();

  // load and process pageLayouts
  useEffect(() => {
    async function loadPageLayouts() {
      const trackTiming = getTimeTracker('load_page_layouts');
      setPageLayouts(await getPageLayouts());
      trackTiming();
    }

    loadPageLayouts();
  }, [getPageLayouts, setPageLayouts]);

  const pills = useMemo(
    () =>
      Object.entries(PAGE_LAYOUT_TYPES).map(([key, { name }]) => ({
        id: key,
        label: name,
      })),
    []
  );

  const filteredPages = useMemo(
    () =>
      pageLayouts.reduce((pages, template) => {
        const templatePages = template.pages.reduce((acc, page) => {
          // skip unselected page layout types if not matching
          if (
            !page.pageLayoutType ||
            (selectedPageLayoutType &&
              page.pageLayoutType !== selectedPageLayoutType)
          ) {
            return acc;
          }

          const pageLayoutName = PAGE_LAYOUT_TYPES[page.pageLayoutType].name;
          return [
            ...acc,
            {
              ...page,
              title: sprintf(
                /* translators: 1: template name. 2: page layout name. */
                _x('%1$s %2$s', 'page layout title', 'web-stories'),
                template.title,
                pageLayoutName
              ),
            },
          ];
        }, []);

        return [...pages, ...templatePages];
      }, []),
    [pageLayouts, selectedPageLayoutType]
  );

  const handleSelectPageLayoutType = useCallback((key) => {
    setSelectedPageLayoutType(key);
    trackEvent('search', {
      search_type: 'page_layouts',
      search_term: '',
      search_category: key,
    });
  }, []);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <PillGroup
          items={pills}
          selectedItemId={selectedPageLayoutType}
          selectItem={handleSelectPageLayoutType}
          deselectItem={() => handleSelectPageLayoutType(null)}
        />
        <PageLayoutsParentContainer ref={pageLayoutsParentRef}>
          {pageLayoutsParentRef.current && (
            <PageLayouts
              parentRef={pageLayoutsParentRef}
              pages={filteredPages}
            />
          )}
        </PageLayoutsParentContainer>
      </PaneInner>
    </StyledPane>
  );
}

export default PageLayoutsPane;
