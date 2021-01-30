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

/**
 * Internal dependencies
 */
import useLayout from '../../app/layout/useLayout';
import { FULLBLEED_RATIO, PAGE_RATIO } from '../../constants';

const Box = styled.aside`
  z-index: 1;
  position: absolute;
  border: 1px solid ${({ theme }) => theme.colors.callout};
`;

function ZoomPreview() {
  const {
    pageWidth,
    pageHeight,
    workspaceWidth,
    workspaceHeight,
    hasVerticalOverflow,
    hasHorizontalOverflow,
    scrollLeft,
    scrollTop,
  } = useLayout(
    ({
      state: {
        pageWidth,
        pageHeight,
        workspaceWidth,
        workspaceHeight,
        hasVerticalOverflow,
        hasHorizontalOverflow,
        scrollLeft,
        scrollTop,
      },
    }) => ({
      pageWidth,
      pageHeight,
      workspaceWidth,
      workspaceHeight,
      hasVerticalOverflow,
      hasHorizontalOverflow,
      scrollLeft,
      scrollTop,
    })
  );

  if (!hasVerticalOverflow && !hasHorizontalOverflow) {
    return null;
  }

  // We need to adjust for danger zone, which isn't displayed in this preview
  const dangerZoneOffset = PAGE_RATIO - FULLBLEED_RATIO;

  // Find relative coordinates in percent of full page
  const left = hasHorizontalOverflow ? scrollLeft / pageWidth : 0;
  const top = hasVerticalOverflow
    ? -dangerZoneOffset + scrollTop / pageHeight
    : 0;

  // Find relative size in percent of full page
  const width = hasHorizontalOverflow ? workspaceWidth / pageWidth : 1;
  const height = hasVerticalOverflow ? workspaceHeight / pageHeight : 1;

  return (
    <Box
      style={{
        left: `${left * 100}%`,
        top: `${top * 100}%`,
        width: `${width * 100}%`,
        height: `${height * 100}%`,
      }}
    />
  );
}

export default ZoomPreview;
