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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../../../testUtils';
import Media3pPane from '../media3pPane';

function ProviderAttribution({ index }) {
  return <span>{`Provider ${index}`}</span>;
}

ProviderAttribution.propTypes = {
  index: PropTypes.number,
};

jest.mock('../../../../useLibrary');
import useLibrary from '../../../../useLibrary';

jest.mock('../../../../../../app/media/useMedia');
import useMedia from '../../../../../../app/media/useMedia';

jest.mock('../../../../../../app/media/media3p/providerConfiguration', () => ({
  PROVIDERS: {
    PROVIDER_1: {
      displayName: 'Provider 1',
      supportedContentTypes: ['image'],
      supportsCategories: true,
      requiresAuthorAttribution: true,
      fetchMediaErrorMessage: 'Error loading media from Provider 1',
      fetchCategoriesErrorMessage: 'Error loading categories from Provider 1',
    },
    PROVIDER_2: {
      displayName: 'Provider 2',
      supportedContentTypes: ['video'],
      supportsCategories: false,
      requiresAuthorAttribution: false,
      fetchMediaErrorMessage: 'Error loading media from Provider 2',
    },
  },
}));

const createMediaResource = (name, provider) => ({
  name,
  provider: provider,
  src: 'http://www.img.com/1',
  width: 480,
  height: 640,
  imageUrls: [
    {
      imageName: 'full',
      url: 'http://www.img.com/1',
      width: 480,
      height: 640,
      mimeType: 'image/png',
    },
    {
      imageName: 'large',
      url: 'http://www.img.com/2',
      width: 300,
      height: 200,
      mimeType: 'image/png',
    },
    {
      imageName: 'web_stories_thumbnail',
      url: 'http://www.img.com/3',
      width: 200,
      height: 100,
      mimeType: 'image/png',
    },
  ],
  description: 'A cat',
  type: 'IMAGE',
  createTime: '1234',
  updateTime: '5678',
});

const DEFAULT_PROVIDER_STATE = (index) => ({
  state: {
    isMediaLoaded: false,
    isMediaLoading: false,
    hasMore: false,
    media: [],
    categories: {
      selectedCategoryId: undefined,
      categories: [
        {
          id: `provider${index}/1`,
          displayName: `Tiny dogs for provider ${index}`,
        },
        {
          id: `provider${index}/2`,
          displayName: `Tiny cats for provider ${index}`,
        },
      ],
    },
  },
  actions: {
    selectCategory: jest.fn(),
    deselectCategory: jest.fn(),
    setNextPage: jest.fn(),
  },
});

const DEFAULT_USE_MEDIA_RESULT = {
  searchTerm: '',
  selectedProvider: undefined,
  setSelectedProvider: jest.fn(),
  setSearchTerm: jest.fn(),
  media3p: {
    PROVIDER_1: DEFAULT_PROVIDER_STATE(1),
    PROVIDER_2: DEFAULT_PROVIDER_STATE(2),
  },
};

const MEDIA = Array(10).fill(createMediaResource('img', 'PROVIDER_1'));

describe('Media3pPane', () => {
  const insertElement = jest.fn();
  let useMediaResult;
  beforeAll(() => {
    useLibrary.mockImplementation((selector) =>
      selector({
        actions: {
          insertElement: insertElement,
        },
      })
    );
    useMedia.mockImplementation(() => useMediaResult);
  });

  beforeEach(() => {
    useMediaResult = DEFAULT_USE_MEDIA_RESULT;
  });

  it('should render <Media3pPane /> with no media', () => {
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(queryByText('No media found')).toBeDefined();
  });

  it('should render <Media3pPane /> with the "Trending" text', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(queryByText('Trending')).toBeDefined();
  });

  it('should render <Media3pPane /> with the category display name when selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.categories.selectedCategoryId =
      'provider1/1';
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { queryByTestId } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(queryByTestId('media-subheading')).toBeDefined();
    expect(queryByTestId('media-subheading')).toHaveTextContent(
      'Tiny dogs for provider 1'
    );
  });
});
