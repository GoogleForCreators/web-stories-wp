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

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { Pane } from '../shared';
import PillGroup from '../shared/pillGroup';
import { getTimeTracker } from '../../../../../tracking/trackTiming';
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

// padding-top is to help outlines on page layouts render
export const PageLayoutsParentContainer = styled.div`
  overflow-x: hidden;
  overflow-y: scroll;
  margin-top: 26px;
  padding-top: 2px;
  width: 100%;
`;

function PageLayoutsPane(props) {
  const {
    actions: { getTemplates },
  } = useAPI();
  const [templates, setTemplates] = useState([]);
  const [selectedPageLayoutType, setSelectedPageLayoutType] = useState(null);

  const pageLayoutsParentRef = useRef();

  // load and process templates
  useEffect(() => {
    const trackTiming = getTimeTracker(
      'load',
      'templates',
      'Page Layouts Pane'
    );
    getTemplates().then((result) => {
      setTemplates(result);
      trackTiming();
    });
  }, [getTemplates, setTemplates]);

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
      templates.reduce((pages, template) => {
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
    [templates, selectedPageLayoutType]
  );

  const handleSelectPageLayoutType = useCallback((key) => {
    setSelectedPageLayoutType(key);
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
        <PageLayoutsParentContainer
          ref={pageLayoutsParentRef}
          title={__('Page Layouts', 'web-stories')}
        >
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
