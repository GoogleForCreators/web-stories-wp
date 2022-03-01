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
import {
  useCallback,
  useRef,
  useEffect,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { useGridViewKeys, useSnackbar } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { PANE_PADDING } from '../shared';
import { duplicatePage } from '../../../../elements';
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import PageTemplate from './pageTemplate';

const WrapperGrid = styled.div`
  display: grid;
  width: 100%;
  margin-left: ${PANE_PADDING};
  gap: 12px;
  grid-template-columns: ${({ columnWidth }) =>
    `repeat(auto-fit, ${columnWidth}px)`};
  grid-template-rows: ${({ rowHeight }) =>
    `repeat(minmax(${rowHeight}px, 1fr))`};
`;

const THRESHOLD = 6;
function TemplateList({
  pages,
  parentRef,
  pageSize,
  handleDelete,
  fetchTemplates,
  ...rest
}) {
  const { addPage } = useStory(({ actions }) => ({
    addPage: actions.addPage,
  }));
  const { showSnackbar } = useSnackbar();
  const { isRTL } = useConfig();

  const containerRef = useRef();
  const pageRefs = useRef({});
  const [currentPageId, setCurrentPageId] = useState();

  const handlePageClick = useCallback(
    ({ templateId, version, title, ...page }) => {
      // Just using destructuring above so we don't pass unnecessary props to addPage().
      const duplicatedPage = duplicatePage(page);
      addPage({ page: duplicatedPage });
      trackEvent('insert_page_template', {
        name: title || 'custom', // Custom page templates don't have titles (yet).
      });
      showSnackbar({
        message: __('Page Template added.', 'web-stories'),
        dismissible: true,
      });
    },
    [addPage, showSnackbar]
  );



  useEffect(() => {
      fetchTemplates?.();
  }, [fetchTemplates]);

  const handleFocus = useCallback((id) => {
    setCurrentPageId(id);
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      // Set `currentPageId` to first item during initial load, or if we have filtered pages by type
      // since the previous `currentPageId` may no longer be present.
      if (!currentPageId || !pages.some((page) => page.id === currentPageId)) {
        setCurrentPageId(pages[0].id);
      }
    }
  }, [currentPageId, pages]);

  useGridViewKeys({
    containerRef: parentRef,
    gridRef: containerRef,
    itemRefs: pageRefs,
    items: pages,
    currentItemId: currentPageId,
    isRTL,
  });

  return (
      <WrapperGrid
        ref={containerRef}
        columnWidth={pageSize.width}
        rowHeight={pageSize.containerHeight}
        role="list"
        aria-label={__('Page Template Options', 'web-stories')}
      >
      {pages.map((page) => (
        <PageTemplate
          key={page.id}
          data-testid={`page_template_${page.id}`}
          ref={(el) => (pageRefs.current[page.id] = el)}
          page={page}
          pageSize={pageSize}
          onClick={() => handlePageClick(page)}
          handleDelete={handleDelete}
          onFocus={() => handleFocus(page.id)}
          {...rest}
        />
      ))}
    </WrapperGrid>
  );
}

TemplateList.propTypes = {
  parentRef: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })
  ),
  pageSize: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  fetchTemplates: PropTypes.func,
};

export default TemplateList;
