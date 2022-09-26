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
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';
import {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  UnitsProvider,
} from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import PageAttachment from '..';
import CanvasContext from '../../../../app/canvas/context';
import StoryContext from '../../../../app/story/context';
import { ConfigProvider } from '../../../../app/config';
import getDefaultConfig from '../../../../getDefaultConfig';

function setup(props = {}) {
  const { pageAttachment = {}, canvasProps = null } = props;
  const canvasContext = {
    state: {
      pageSize: {},
      displayLinkGuidelines: false,
      pageAttachmentContainer: null,
      currentPage: {
        elements: [],
      },
      ...canvasProps,
    },
    actions: { setPageAttachmentContainer: jest.fn() },
  };
  const storyContext = {
    state: {
      currentPage: {
        elements: [],
      },
    },
  };
  return renderWithTheme(
    <ConfigProvider config={getDefaultConfig()}>
      <StoryContext.Provider value={storyContext}>
        <CanvasContext.Provider value={canvasContext}>
          <UnitsProvider
            pageSize={{
              height: PAGE_HEIGHT,
              width: PAGE_WIDTH,
            }}
            dataToEditorY={jest.fn()}
          >
            <PageAttachment pageAttachment={pageAttachment} />
          </UnitsProvider>
        </CanvasContext.Provider>
      </StoryContext.Provider>
    </ConfigProvider>
  );
}

describe('PageAttachment', () => {
  it('should display only wrapper in case of empty Page Attachment', () => {
    setup();
    const pageAttachment = screen.getByRole('presentation');
    expect(pageAttachment).toBeInTheDocument();
    expect(pageAttachment).toBeEmptyDOMElement();
  });

  it('should display the configured Page Attachment', () => {
    setup({
      pageAttachment: { url: 'http://example.test', ctaText: 'Click me!' },
    });
    const ctaText = screen.getByText('Click me!');
    expect(ctaText).toBeInTheDocument();
  });

  it('should display default CTA Text if none set', () => {
    setup({
      pageAttachment: { url: 'http://example.test' },
    });
    const ctaText = screen.getByText('Learn more');
    expect(ctaText).toBeInTheDocument();
  });

  it('should display dotted line if link found in the area', () => {
    setup({
      canvasProps: {
        displayLinkGuidelines: true,
      },
    });
    const pageAttachment = screen.getByRole('presentation');
    // The guiding line is always displayed right before the page attachment, on the same level.
    // eslint-disable-next-line testing-library/no-node-access
    const guideline = pageAttachment.previousSibling;
    expect(guideline).toBeDefined();
    const style = window.getComputedStyle(guideline);
    // Verify the background was added for displaying dashed line.
    expect(style.backgroundSize).toBe('16px 0.5px');
    expect(style.backgroundPosition).toBe('top');
  });
});
