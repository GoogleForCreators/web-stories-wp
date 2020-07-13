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
import React from 'react';

/**
 * Internal dependencies
 */
import TransformContext from '../../../transform/context';
import PageAttachment from '../index';
import CanvasContext from '../../context';
import { renderWithTheme } from '../../../../testUtils';

function setup(props = {}) {
  const {
    pageAttachment = {},
    isAnythingTransforming = false,
    canvasProps = null,
  } = props;
  const canvasContext = {
    state: {
      pageSize: {},
      hasLinkInAttachmentArea: false,
      pageAttachmentContainer: null,
      ...canvasProps,
    },
    actions: { setPageAttachmentContainer: jest.fn() },
  };
  const transformContext = {
    state: {
      isAnythingTransforming,
    },
  };
  const { getByText, getByRole } = renderWithTheme(
    <CanvasContext.Provider value={canvasContext}>
      <TransformContext.Provider value={transformContext}>
        <PageAttachment pageAttachment={pageAttachment} />
      </TransformContext.Provider>
    </CanvasContext.Provider>
  );
  return {
    getByText,
    getByRole,
  };
}

describe('PageAttachment', () => {
  it('should display only wrapper in case of empty Page Attachment', () => {
    const { getByRole } = setup();
    const pageAttachment = getByRole('presentation');
    expect(pageAttachment).toBeDefined();
    expect(pageAttachment).toBeEmptyDOMElement();
  });

  it('should display the configured Page Attachment', () => {
    const { getByText } = setup({
      pageAttachment: { url: 'http://example.test', ctaText: 'Click me!' },
    });
    const ctaText = getByText('Click me!');
    expect(ctaText).toBeDefined();
  });

  it('should display default CTA Text if none set', () => {
    const { getByText } = setup({
      pageAttachment: { url: 'http://example.test' },
    });
    const ctaText = getByText('Learn more');
    expect(ctaText).toBeDefined();
  });

  it('should display dotted line if link found in the area', () => {
    const { getByRole } = setup({
      canvasProps: {
        hasLinkInAttachmentArea: true,
      },
    });
    const pageAttachment = getByRole('presentation');
    // The guiding line is always displayed right before the page attachment, on the same level.
    const guideline = pageAttachment.previousSibling;
    expect(guideline).toBeDefined();
    const style = window.getComputedStyle(guideline);
    // Verify the background was added for displaying dashed line.
    expect(style.backgroundSize).toStrictEqual('16px 0.5px');
    expect(style.backgroundPosition).toStrictEqual('top');
  });

  it('should display tooltip if link is being transformed on Page Attachment', () => {
    const { getByText } = setup({
      pageAttachment: { url: 'http://example.test', ctaText: 'Click me!' },
      isAnythingTransforming: true,
      canvasProps: {
        hasLinkInAttachmentArea: true,
        pageAttachmentContainer: document.body,
      },
    });
    const popup = getByText(
      'Links can not be located below the dashed line when a page attachment is present'
    );
    expect(popup).toBeDefined();
  });
});
