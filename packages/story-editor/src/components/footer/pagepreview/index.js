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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import { generatePatternStyles } from '@googleforcreators/patterns';
import {
  PAGE_RATIO,
  FULLBLEED_RATIO,
  UnitsProvider,
} from '@googleforcreators/units';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from '@googleforcreators/react';
import { TransformProvider } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import { usePageCanvas } from '../../../app/pageCanvas';
import DisplayElement from '../../canvas/displayElement';
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../constants';

const Page = styled.button`
  display: block;
  position: relative;
  cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
  padding: 0;
  border: 0;
  background-color: transparent;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  flex: none;
  outline: 0;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: -4px;
    right: -4px;
    top: -4px;
    bottom: -4px;
    pointer-events: none;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    border-color: ${({ isActive, isInteractive, theme }) =>
      isInteractive && isActive
        ? theme.colors.border.defaultActive
        : 'transparent'};
  }

  ${({ isInteractive, isActive, theme }) =>
    isInteractive &&
    css`
      &:focus::after {
        border-color: ${rgba(
          theme.colors.border.selection,
          isActive ? 1 : 0.7
        )};
      }
    `}
`;

const PageOffset = styled.div`
  position: relative;
  top: ${({ $top }) => $top}px;
`;

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  ${({ background }) => generatePatternStyles(background)}
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  left: 0;

  // image will always be vertically centered
  // so we don't need to alter height of image
  // when it's in the fullbleed ratio and the
  // thumbnail is in the smaller ratio
  top: 50%;
  transform: translateY(-50%);
`;

function PagePreview({ page, label, ...props }) {
  const { backgroundColor } = page;
  const { width, isActive } = props;

  const height = Math.round(width / PAGE_RATIO);
  const fullHeight = Math.round(width / FULLBLEED_RATIO);
  const pageYOffset = (fullHeight - height) / 2;

  const { pageCanvas, generateDeferredPageCanvas } = usePageCanvas(
    ({ state, actions }) => ({
      pageCanvas: state.pageCanvasMap[page.id],
      generateDeferredPageCanvas: actions.generateDeferredPageCanvas,
    })
  );
  const [pageNode, setPageNode] = useState();
  const setPageRef = useCallback((node) => node && setPageNode(node), []);

  // Generate a canvas if we don't have one
  useEffect(() => {
    // Avoid frequent generation of active pages as well
    // due to rapid cache invalidation from frequent updates
    // to page.
    if (isActive || pageCanvas) {
      return;
    }

    generateDeferredPageCanvas([page.id, page]);
  }, [page, pageCanvas, isActive, generateDeferredPageCanvas]);

  // Grab image off of canvas if we got a canvas
  // from the cache
  const pageImage = useMemo(
    () => pageCanvas?.toDataURL('image/png'),
    [pageCanvas]
  );

  usePerformanceTracking({
    node: pageNode,
    eventData: TRACKING_EVENTS.PAGE_PREVIEW_CLICK,
  });

  return (
    <UnitsProvider pageSize={{ width, height }}>
      <TransformProvider>
        <Page
          ref={setPageRef}
          aria-label={label}
          height={fullHeight}
          {...props}
        >
          <PreviewWrapper background={backgroundColor}>
            {pageImage ? (
              <Image
                draggable="false"
                src={pageImage}
                alt={label}
                decoding="async"
              />
            ) : (
              <PageOffset $top={pageYOffset}>
                {page.elements.map((element) => (
                  <DisplayElement
                    key={element.id}
                    previewMode
                    element={element}
                  />
                ))}
              </PageOffset>
            )}
          </PreviewWrapper>
        </Page>
      </TransformProvider>
    </UnitsProvider>
  );
}

PagePreview.propTypes = {
  page: StoryPropTypes.page.isRequired,
  label: PropTypes.string,
  width: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool,
  isActive: PropTypes.bool,
  tabIndex: PropTypes.number,
};

export default PagePreview;
