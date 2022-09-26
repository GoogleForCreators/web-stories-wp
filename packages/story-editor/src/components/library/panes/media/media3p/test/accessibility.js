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
import { axe } from 'jest-axe';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import Media3pIcon from '../media3pIcon';
import ProviderTab from '../providerTab';
import PaginatedMediaGallery from '../../common/paginatedMediaGallery';
import { noop } from '../../../../../../utils/noop';
import {
  useCanvas,
  useCanvasBoundingBox,
  useLocalMedia,
} from '../../../../../../app';

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

const RESOURCES = [
  {
    alt: 'alt text',
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

describe('automated accessibility tests', () => {
  const mockUseCanvas = useCanvas;
  const mockUseCanvasBoundingBox = useCanvasBoundingBox;

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
  it('should render Media3pIcon without accessibility violations', async () => {
    const { container } = renderWithTheme(<Media3pIcon />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render ProviderTab without accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ProviderTab name="jane of ark" isActive />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render PaginatedMediaGallery without accessibility violations', async () => {
    const { container } = renderWithTheme(
      <PaginatedMediaGallery
        providerType="local"
        resources={RESOURCES}
        isMediaLoading={false}
        isMediaLoaded
        hasMore
        onInsert={noop}
        setNextPage={noop}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
