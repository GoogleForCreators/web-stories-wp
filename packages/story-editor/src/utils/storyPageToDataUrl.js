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
import { theme as ds_theme } from '@web-stories-wp/design-system';
import {
  forwardRef,
  render,
  unmountComponentAtNode,
} from '@web-stories-wp/react';
import {
  PAGE_RATIO,
  FULLBLEED_RATIO,
  UnitsProvider,
} from '@web-stories-wp/units';
import styled, { ThemeProvider } from 'styled-components';
import { generatePatternStyles } from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { FontProvider } from '../app/font';
import DisplayElement from '../components/canvas/displayElement';
import { TransformProvider } from '../components/transform';

const Page = styled.div`
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

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.fg.white};
  border-radius: 4px;
  ${({ background }) => generatePatternStyles(background)}
`;

const PageWithDependencies = forwardRef(function PageWithDependencies(
  { page, width, height },
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
            <Page ref={ref} height={height} width={width}>
              <PreviewWrapper background={page.backgroundColor}>
                {page.elements.map((element) => (
                  <DisplayElement
                    key={element.id}
                    previewMode
                    element={element}
                  />
                ))}
              </PreviewWrapper>
            </Page>
          </UnitsProvider>
        </TransformProvider>
      </FontProvider>
    </ThemeProvider>
  );
});

/**
 * @typedef {import('../../../types').Page} Page
 */

/**
 * Async method to generate a dataUrl from a story page.
 *
 * @param {Page} page Page object.
 * @param {Object} options options to pass to htmlToImage.toJpeg
 * @param {number} options.width desired width of image. Dictates height and container height
 * @return {Promise<string>} jpeg dataUrl
 */
async function storyPageToDataUrl(page, { width = 400, ...options }) {
  const htmlToImage = await import(
    /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
  );

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

  const node = await new Promise((resolve) => {
    const resolverRef = (htmlNode) => {
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
      />,
      bufferRoot
    );
  });

  document.body.appendChild(bufferRoot);

  const dataUrl = await htmlToImage.toJpeg(node, {
    ...options,
    width,
    height: width * (1 / PAGE_RATIO),
    canvasHeight: width * (1 / PAGE_RATIO),
    canvasWidth: width,
  });

  unmountComponentAtNode(bufferRoot);
  document.body.removeChild(bufferRoot);

  return dataUrl;
}

export default storyPageToDataUrl;
