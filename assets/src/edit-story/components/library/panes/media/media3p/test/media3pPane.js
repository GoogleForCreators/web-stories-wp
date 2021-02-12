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
import { fireEvent } from '@testing-library/react';

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
      supportsCategories: true,
      requiresAuthorAttribution: true,
      fetchMediaErrorMessage: 'Error loading media from Provider 1',
      fetchCategoriesErrorMessage: 'Error loading categories from Provider 1',
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
          label: `${index} Dogs`,
        },
        {
          id: `provider${index}/2`,
          label: `${index} Cats`,
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

    // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
    window.HTMLElement.prototype.scrollTo = () => {};
  });

  beforeEach(() => {
    useMediaResult = DEFAULT_USE_MEDIA_RESULT;
  });

  it('should display terms dialog', () => {
    const { queryByText, getByRole } = renderWithTheme(
      <Media3pPane isActive={true} />
    );

    expect(
      queryByText(/Your use of stock content is subject to third party terms/)
    ).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Dismiss' }));

    expect(
      queryByText('Your use of stock content is subject to third party terms.')
    ).not.toBeInTheDocument();
  });

  it('should render <Media3pPane /> with no media', () => {
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(queryByText('No media found')).not.toBeInTheDocument();
    expect(getComputedStyle(queryByText('Trending')).display).toBe('none');
  });

  it('should render "No media found" text once loading is completed', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = false;
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(queryByText('No media found')).toBeInTheDocument();
    expect(getComputedStyle(queryByText('Trending')).display).toBe('none');
  });

  it('should render <Media3pPane /> with no "Trending" text while media is being loaded', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = false;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = true;
    useMediaResult.media3p.PROVIDER_1.state.media = [];
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(getComputedStyle(queryByText('Trending')).display).toBe('none');
  });

  it('should render <Media3pPane /> with the "Trending" text while a new page is being loaded', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = false;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(getComputedStyle(queryByText('Trending')).display).not.toBe('none');
  });

  it('should render <Media3pPane /> with the "Trending" text', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { queryByText } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(getComputedStyle(queryByText('Trending')).display).not.toBe('none');
  });

  it('should render <Media3pPane /> with enabled search when a category is not selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { container } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(container.querySelector('input')).toBeEnabled();
  });

  it('should render <Media3pPane /> with disabled search when a category is selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    useMediaResult.selectedProvider = 'PROVIDER_1';
    useMediaResult.media3p.PROVIDER_1.state.categories.selectedCategoryId =
      'provider1/1';
    const { container } = renderWithTheme(<Media3pPane isActive={true} />);

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('should render <Media3pPane /> with the category display name when selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { getByTestId } = renderWithTheme(<Media3pPane isActive={true} />);

    const subHeading = getByTestId('media-subheading');

    expect(getComputedStyle(subHeading).display).not.toBe('none');
    expect(subHeading).toHaveTextContent('1 Dogs');
  });
});
