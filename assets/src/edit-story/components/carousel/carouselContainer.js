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
import { memo, useMemo, useRef, useState } from 'react';
import { useResizeEffect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { ChecklistProvider } from '../checklist';
import { KeyboardShortcutsMenuProvider } from '../keyboardShortcutsMenu/keyboardShortcutsMenuContext';
import CarouselLayout from './carouselLayout';
import CarouselProvider from './carouselProvider';
import { VERY_WIDE_WORKSPACE_LIMIT, VERY_WIDE_MARGIN } from './constants';

const Outer = styled.section`
  height: 100%;
`;
const Inner = styled(Outer)`
  margin-right: ${({ marginRight }) => marginRight}px;
`;

function CarouselContainer() {
  const ref = useRef();
  const [workspaceWidth, setWorkspaceWidth] = useState(0);

  useResizeEffect(ref, ({ width }) => setWorkspaceWidth(width), []);
  const [margin, width] = useMemo(() => {
    const rightMargin =
      workspaceWidth >= VERY_WIDE_WORKSPACE_LIMIT ? VERY_WIDE_MARGIN : 0;
    return [rightMargin, workspaceWidth - rightMargin];
  }, [workspaceWidth]);

  return (
    <CarouselProvider availableSpace={width}>
      <ChecklistProvider>
        <KeyboardShortcutsMenuProvider>
          <Outer ref={ref}>
            <Inner marginRight={margin}>
              <CarouselLayout />
            </Inner>
          </Outer>
        </KeyboardShortcutsMenuProvider>
      </ChecklistProvider>
    </CarouselProvider>
  );
}

// Don't rerender the carousel container needlessly e.g. on element selection change.
export default memo(CarouselContainer);
