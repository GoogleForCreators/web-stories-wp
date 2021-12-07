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
import { theme } from '@web-stories-wp/design-system';
import {
  forwardRef,
  render,
  unmountComponentAtNode,
} from '@web-stories-wp/react';
import {
  FULLBLEED_RATIO,
  PAGE_RATIO,
  UnitsProvider,
} from '@web-stories-wp/units';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import { FileProvider } from '../app/file';
import { FontProvider } from '../app/font';
import { PreviewErrorBoundary, PreviewPage } from '../components/previewPage';
import { TransformProvider } from '../components/transform';

const PageWithDependencies = forwardRef(function PageWithDependencies(
  { page, width },
  ref
) {
  return (
    <ThemeProvider theme={theme}>
      <FileProvider>
        <FontProvider>
          <TransformProvider>
            <UnitsProvider
              pageSize={{
                width: width,
                height: width * (1 / PAGE_RATIO),
              }}
            >
              <PreviewErrorBoundary>
                <PreviewPage
                  ref={ref}
                  page={page}
                  pageSize={{
                    width: width,
                    height: width * (1 / PAGE_RATIO),
                    containerHeight: width * (1 / FULLBLEED_RATIO),
                  }}
                />
              </PreviewErrorBoundary>
            </UnitsProvider>
          </TransformProvider>
        </FontProvider>
      </FileProvider>
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
 * @return {string} jpeg dataUrl
 */
async function storyPageToDataUrl(page, { width = 400, ...options }) {
  const htmlToImage = await import(
    /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
  );

  const bufferRoot = document.createElement('div');
  const node = await new Promise((resolve) => {
    const resolverRef = (htmlNode) => {
      if (!htmlNode) {
        return;
      }
      resolve(htmlNode);
    };

    render(
      <PageWithDependencies ref={resolverRef} page={page} width={width} />,
      bufferRoot
    );
  });

  const dataUrl = await htmlToImage.toJpeg(node, {
    ...options,
    width,
    height: width * (1 / PAGE_RATIO),
  });

  unmountComponentAtNode(bufferRoot);

  return dataUrl;
}

export default storyPageToDataUrl;
