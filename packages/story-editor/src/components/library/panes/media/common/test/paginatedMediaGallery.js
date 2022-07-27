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
import { waitFor, screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import {
  useCanvas,
  useCanvasBoundingBox,
  useLocalMedia,
} from '../../../../../../app';
import PaginatedMediaGallery from '../paginatedMediaGallery';

jest.mock('../../../../../../app/media');

jest.mock('../../../../../../app/canvas', () => ({
  ...jest.requireActual('../../../../../../app/canvas'),
  useCanvas: jest.fn(),
  useCanvasBoundingBox: jest.fn(),
}));

const mockCanvasContext = {
  fullbleedContainer: {},
  nodesById: {},
  pageContainer: { getBoundingClientRect: () => ({ x: 0, y: 0 }) },
};

describe('paginatedMediaGallery', () => {
  const providerType = 'unsplash';
  const resources = [
    {
      alt: null,
      attribution: {
        author: {
          displayName: 'Maria',
          url: 'http://maria.com',
        },
        registerUsageUrl: '',
      },
      creationDate: '1234',
      height: 353,
      id: undefined,
      length: null,
      lengthFormatted: null,
      mimeType: 'image/jpeg',
      poster: null,
      posterId: null,
      sizes: {
        full: {
          file: 'media/unsplash:1234',
          sourceUrl: 'http://lala.com',
          mimeType: 'image/jpeg',
          width: 530,
          height: 353,
        },
      },
      src: 'http://lala.com',
      type: 'image',
      width: 530,
    },
  ];
  const mockUseCanvas = useCanvas;
  const mockUseCanvasBoundingBox = useCanvasBoundingBox;

  beforeAll(() => {
    // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
    window.HTMLElement.prototype.scrollTo = () => {};
  });

  beforeEach(() => {
    mockUseCanvas.mockReturnValue(mockCanvasContext);
    mockUseCanvasBoundingBox.mockReturnValue({ x: 0, y: 0 });
    useLocalMedia.mockReturnValue({
      isCurrentResourceTrimming: jest.fn(),
      isCurrentResourceMuting: jest.fn(),
      isCurrentResourceTranscoding: jest.fn(),
      isCurrentResourceProcessing: jest.fn(),
      isCurrentResourceUploading: jest.fn(),
      isNewResourceProcessing: jest.fn(),
    });
  });

  it('should render attribution when media is present', () => {
    renderWithTheme(
      <PaginatedMediaGallery
        providerType={providerType}
        resources={resources}
        isMediaLoading={false}
        isMediaLoaded
        hasMore={false}
        onInsert={() => {}}
        setNextPage={() => {}}
      />
    );

    expect(screen.getByText(/Powered by/)).toBeInTheDocument();
    expect(screen.queryByTestId('loading-pill')).not.toBeInTheDocument();
  });

  it('should render the loading pill when media is loading', async () => {
    renderWithTheme(
      <PaginatedMediaGallery
        providerType={providerType}
        resources={resources}
        isMediaLoading
        isMediaLoaded={false}
        hasMore
        onInsert={() => {}}
        setNextPage={() => {}}
      />
    );

    expect(screen.getByText(/Powered by/)).toBeInTheDocument();
    expect(screen.queryByTestId('loading-pill')).not.toBeInTheDocument();

    // The loading indicator only appears (and thus the attribution disappears)
    // if loading takes too long.
    await waitFor(
      () => {
        expect(screen.queryByText(/Powered by/)).not.toBeInTheDocument();
      },
      {
        timeout: 1000,
      }
    );

    expect(screen.queryByText(/Powered by/)).not.toBeInTheDocument();
  });
});
