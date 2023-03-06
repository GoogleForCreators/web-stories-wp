/*
 * Copyright 2021 Google LLC
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
import { theme as ds_theme } from '@googleforcreators/design-system';
import {
  forwardRef,
  render,
  unmountComponentAtNode,
} from '@googleforcreators/react';
import {
  PAGE_RATIO,
  FULLBLEED_RATIO,
  UnitsProvider,
} from '@googleforcreators/units';
import styled, { ThemeProvider } from 'styled-components';
import {
  generatePatternStyles,
  type Pattern,
} from '@googleforcreators/patterns';
import { TransformProvider } from '@googleforcreators/transform';
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { FontProvider } from '../../font';
import DisplayElement from '../../../components/canvas/displayElement';

const StoryPage = styled.div<{ height: number; width: number }>`
  display: block;
  position: relative;
  padding: 0;
  border: 0;
  background-color: transparent;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  flex: none;
  outline: 0;
`;

const PreviewWrapper = styled.div<{ background: Pattern }>`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) =>
    (theme as typeof ds_theme).colors.standard.white};
  border-radius: 4px;
  ${({ background }) => generatePatternStyles(background)}
`;

const FullHeight = styled.div<{ yOffset: number }>`
  position: absolute;
  top: ${({ yOffset }) => yOffset}px;
  bottom: ${({ yOffset }) => yOffset}px;
  right: 0;
  left: 0;
`;

interface PageWithDepsProps {
  page: Page;
  width: number;
  height: number;
  renderFullHeightThumb?: boolean;
  containerHeight: number;
}
const PageWithDependencies = forwardRef<HTMLDivElement, PageWithDepsProps>(
  function PageWithDependencies(
    {
      page,
      width,
      height,
      renderFullHeightThumb = false,
      containerHeight,
    }: PageWithDepsProps,
    ref
  ) {
    return (
      <ThemeProvider theme={ds_theme}>
        <FontProvider>
          <TransformProvider>
            <UnitsProvider
              pageSize={{
                width,
                height,
              }}
            >
              <StoryPage
                ref={ref}
                height={renderFullHeightThumb ? containerHeight : height}
                width={width}
              >
                <PreviewWrapper background={page.backgroundColor}>
                  <FullHeight
                    yOffset={
                      renderFullHeightThumb ? (containerHeight - height) / 2 : 0
                    }
                  >
                    {page.elements.map((element) => (
                      <DisplayElement
                        key={element.id}
                        previewMode
                        element={element}
                      />
                    ))}
                  </FullHeight>
                </PreviewWrapper>
              </StoryPage>
            </UnitsProvider>
          </TransformProvider>
        </FontProvider>
      </ThemeProvider>
    );
  }
);

/**
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

interface Options {
  renderFullHeightThumb?: boolean;
}
/**
 * Takes a story page and generates a DOM node containing the rendered
 * page. Returns a tuple containing the page DOM node and a cleanup
 * method to remove the returned DOM node.
 *
 * **IMPORTANT:** Not calling the returned `cleanup()` method after use of
 * page DOM node will result in memory leak.
 */
async function storyPageToNode(
  page: Page,
  width: number,
  opts: Options = {}
): Promise<[HTMLElement, () => void]> {
  const { renderFullHeightThumb = false } = opts;
  const height = width * (1 / PAGE_RATIO);
  const containerHeight = width * (1 / FULLBLEED_RATIO);

  const bufferRoot = document.createElement('div');
  bufferRoot.style.cssText = `
     contain: strict;
     position: absolute;
     top: 0;
     left: 0;
     width: ${width}px;
     height: ${containerHeight}px;
     opacity: 0;
     transform: translate(-100%, -100%);
     pointer-events: none;
   `;

  const node: HTMLElement = await new Promise((resolve) => {
    const resolverRef = (htmlNode: HTMLDivElement) => {
      if (!htmlNode) {
        return;
      }
      resolve(htmlNode);
    };

    render(
      <PageWithDependencies
        ref={resolverRef}
        page={page}
        width={width}
        height={height}
        containerHeight={containerHeight}
        renderFullHeightThumb={renderFullHeightThumb}
      />,
      bufferRoot
    );
  });

  document.body.appendChild(bufferRoot);
  const cleanup = () => {
    unmountComponentAtNode(bufferRoot);
    document.body.removeChild(bufferRoot);
  };

  return [node, cleanup];
}
export default storyPageToNode;
