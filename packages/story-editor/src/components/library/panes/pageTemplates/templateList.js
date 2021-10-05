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
import { useCallback, useRef, useState } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useGridViewKeys, useSnackbar } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { v4 as uuidv4 } from 'uuid';
import { duplicatePage } from '../../../../elements';
import { useStory } from '../../../../app/story';
import PageTemplate from './pageTemplate';

const WrapperGrid = styled.ul`
  display: grid;
  width: 100%;
  grid-column-gap: 4px;
  grid-row-gap: 4px;
  grid-template-columns: ${({ columnWidth }) =>
    `repeat(auto-fit, ${columnWidth}px)`};
  grid-template-rows: ${({ rowHeight }) =>
    `repeat(minmax(${rowHeight}px, 1fr))`};
`;

const PageTemplateWrapper = styled.li``;
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
  const [currentPageId, setCurrentPageId] = useState();
  const [isGridFocused, setIsGridFocused] = useState(false);
  const containerRef = useRef();
  const pageRefs = useRef({});

  const handlePageClick = useCallback(
    (page) => {
      const duplicatedPage = duplicatePage(page);
      addPage({ page: duplicatedPage });
      trackEvent('insert_page_template', {
        name: page.title,
      });
      showSnackbar({
        message: __('Page Template added.', 'web-stories'),
        dismissable: true,
      });
    },
    [addPage, showSnackbar]
  );

  const handleKeyboardPageClick = useCallback(
    ({ code }, page) => {
      if (isGridFocused) {
        if (code === 'Enter') {
          handlePageClick(page);
        }
      }
    },
    [isGridFocused, handlePageClick]
  );

  const handleGridFocus = useCallback(() => {
    if (!isGridFocused) {
      const newGridItemId = pageRefs.current?.[currentPageId]
        ? currentPageId
        : pages.id?.[0];

      setIsGridFocused(true);
      pageRefs.current?.[newGridItemId]?.focus();
    }
  }, [currentPageId, isGridFocused, pages]);

  useGridViewKeys({
    containerRef: parentRef,
    gridRef: containerRef,
    itemRefs: pageRefs,
    items: pages,
    currentItemId: currentPageId,
  });

  return (
    <WrapperGrid
      ref={containerRef}
      columnWidth={pageSize.width}
      rowHeight={pageSize.containerHeight}
      onFocus={handleGridFocus}
      {...rest}
    >
      {pages.map((page) => {
        return (
          <PageTemplateWrapper key={uuidv4()}>
            <PageTemplate
              data-testid={`page_template_${page.id}`}
              page={page}
              pageSize={pageSize}
              isActive={currentPageId === page.id}
              onFocus={() => {
                setCurrentPageId(page.id);
              }}
              onClick={() => handlePageClick(page.story)}
              onKeyUp={(event) => handleKeyboardPageClick(event, page)}
              columnWidth={pageSize.width}
              {...rest}
            />
          </PageTemplateWrapper>
        );
      })}
    </WrapperGrid>
  );
}

TemplateList.propTypes = {
  parentRef: PropTypes.object.isRequired,
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  pageSize: PropTypes.object.isRequired,
  handleDelete: PropTypes.func,
  fetchTemplates: PropTypes.func,
};

export default TemplateList;
