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
/**
 * Internal dependencies
 */
import { useCanvas } from '../../../../../../app';
import { renderWithTheme } from '../../../../../../testUtils';
import Attribution from '../attribution';
import MediaElement from '../mediaElement';

jest.mock('../../../../../../app/canvas', () => ({
  useCanvas: jest.fn(),
}));

const RESOURCE = {
  alt: 'image of maria',
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
  local: false,
  mimeType: 'image/jpeg',
  poster: null,
  posterId: null,
  sizes: {
    full: {
      file: 'media/unsplash:1234',
      source_url: 'http://lala.com',
      mime_type: 'image/jpeg',
      width: 530,
      height: 353,
    },
  },
  src: 'http://lala.com',
  type: 'image',
  width: 530,
};

const mockCanvasContext = {
  fullbleedContainer: {},
  nodesById: {},
  pageContainer: { getBoundingClientRect: () => ({ x: 0, y: 0 }) },
};

describe('automated accessibility tests', () => {
  const mockUseCanvas = useCanvas;

  beforeEach(() => {
    mockUseCanvas.mockReturnValue(mockCanvasContext);
  });

  it('should render MediaElement without accessibility violations', async () => {
    const { container } = renderWithTheme(
      <MediaElement
        index={0}
        resource={RESOURCE}
        width={RESOURCE.width}
        height={RESOURCE.height}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    // transcoding
    const { container: container2 } = renderWithTheme(
      <MediaElement
        index={0}
        resource={{ ...RESOURCE, isTranscoding: true }}
        width={RESOURCE.width}
        height={RESOURCE.height}
      />
    );

    const transcodingResults = await axe(container2);
    expect(transcodingResults).toHaveNoViolations();
  });

  it('should render Attribution without accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Attribution author="Juan of Ark" url="https://www.juanofark.com" />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
