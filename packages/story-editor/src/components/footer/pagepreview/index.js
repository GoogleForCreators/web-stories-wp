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
import { UnitsProvider } from '@googleforcreators/units';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from '@googleforcreators/react';
import { TransformProvider } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../../utils/idleCallback';
import DisplayElement from '../../canvas/displayElement';
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../../constants/performanceTrackingEvents';

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
    border-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.border.defaultActive : 'transparent'};
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

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  ${({ background }) => generatePatternStyles(background)}
`;

const Image = styled.img`
  width: 100%;
`;

// PagePreview is used in the editor's Carousel as well as in the Checklist and GridView
function PagePreview({
  page,
  label,
  isCacheable = false,
  cachedImage = null,
  setCachedImage = null,
  ...props
}) {
  const { backgroundColor } = page;
  const { width, height, isActive } = props;

  const [pageNode, setPageNode] = useState();
  const setPageRef = useCallback((node) => node && setPageNode(node), []);
  const pageAtGenerationTime = useRef();

  // Whenever the page is re-generated
  // remove the old (and now stale) image blob
  useEffect(() => {
    if (isCacheable && isActive && pageAtGenerationTime.current !== page) {
      setCachedImage({ pageId: page.id, cachedImage: null });
      pageAtGenerationTime.current = null;
    }
  }, [page, setCachedImage, isActive, isCacheable]);

  useEffect(() => {
    // If this is not the active page, there is a page node, we
    // don't already have a snapshot and thumbnail caching is active
    if (isCacheable && !isActive && pageNode && !cachedImage) {
      // Schedule an idle callback to actually generate the image
      const id = requestIdleCallback(
        () => {
          import(
            /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
          ).then((htmlToImage) => {
            htmlToImage
              .toJpeg(pageNode, { quality: 1 })
              .then((image) =>
                setCachedImage({ pageId: page.id, cachedImage: image })
              );
            pageAtGenerationTime.current = page;
          });
        },
        { timeout: 5000 }
      );
      // If the page somehow regenerates before the snapshot is taken,
      // make sure to cancel the old request
      return () => cancelIdleCallback(id);
    }
    // Required because of eslint: consistent-return
    return undefined;
  }, [isCacheable, isActive, pageNode, cachedImage, setCachedImage, page]);

  usePerformanceTracking({
    node: pageNode,
    eventData: TRACKING_EVENTS.PAGE_PREVIEW_CLICK,
  });

  return (
    <UnitsProvider pageSize={{ width, height }}>
      <TransformProvider>
        <Page ref={setPageRef} aria-label={label} {...props}>
          <PreviewWrapper background={backgroundColor}>
            {cachedImage ? (
              <Image
                src={cachedImage}
                width={width}
                height={height}
                alt={label}
                decoding="async"
              />
            ) : (
              page.elements.map((element) => (
                <DisplayElement
                  key={element.id}
                  previewMode
                  element={element}
                />
              ))
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
  isCacheable: PropTypes.bool,
  cachedImage: PropTypes.string,
  setCachedImage: PropTypes.func,
  pageImageData: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool,
  isActive: PropTypes.bool,
  tabIndex: PropTypes.number,
};

export default PagePreview;
