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
import styled from 'styled-components';
import {
  generatePatternStyles,
  getSolidFromHex,
  isHexColorString,
} from '@googleforcreators/patterns';
import { type ElementId, elementIs } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useCarousel } from './carouselContext';

const EmptyPage = styled.li.attrs({ role: 'presentation' })`
  display: block;
  position: relative;
  flex: 0 0;
  margin: 0;
  padding: 0;
  border-radius: 4px;
`;

function SkeletonPage({ pageId, index }: { pageId: ElementId; index: number }) {
  const { pageThumbWidth, pageThumbHeight, pageThumbMargin, hasPage, bgColor } =
    useCarousel(
      ({
        state: { pageThumbWidth, pageThumbHeight, pageThumbMargin, pages },
      }) => {
        let bgColor = null;

        const page = pages.find(({ id }) => id === pageId);

        if (page) {
          bgColor = page.backgroundColor;
          const bgElement = page.elements[0];

          // Using isHexColorString for extra hardening.
          // See https://github.com/googleforcreators/web-stories-wp/issues/9888.
          if (
            elementIs.media(bgElement) &&
            bgElement.resource.baseColor &&
            isHexColorString(bgElement.resource.baseColor)
          ) {
            bgColor = getSolidFromHex(
              bgElement.resource.baseColor.replace('#', '')
            );
          }
        }

        return {
          pageThumbWidth,
          pageThumbHeight,
          pageThumbMargin,
          hasPage: Boolean(page && page.id),
          bgColor,
        };
      }
    );

  if (!hasPage) {
    return null;
  }

  return (
    <EmptyPage
      style={{
        flexBasis: `${pageThumbWidth}px`,
        height: `${pageThumbHeight}px`,
        marginLeft: `${index === 0 ? pageThumbMargin : 0}px`,
        marginRight: `${pageThumbMargin}px`,
        ...generatePatternStyles(bgColor),
      }}
      data-testid={`carousel-page-preview-skeleton-${pageId}`}
    />
  );
}

export default SkeletonPage;
