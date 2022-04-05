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
import { fireEvent, screen } from '@testing-library/react';
import {
  renderWithTheme,
  setUpEditorStore,
} from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import { createResource } from '@googleforcreators/media';
import useLibrary from '../../../../useLibrary';
import useConfig from '../../../../../../app/config/useConfig';
import useMedia from '../../../../../../app/media/useMedia';
import useLocalMedia from '../../../../../../app/media/local/useLocalMedia';
import useMedia3pApi from '../../../../../../app/media/media3p/api/useMedia3pApi';
import Media3pPane from '../media3pPane';

function ProviderAttribution({ index }) {
  return <span>{`Provider ${index}`}</span>;
}

ProviderAttribution.propTypes = {
  index: PropTypes.number,
};

jest.mock('../../../../useLibrary');
jest.mock('../../../../../../app/config/useConfig');
jest.mock('../../../../../../app/media/useMedia');
jest.mock('../../../../../../app/media/local/useLocalMedia');
jest.mock('../../../../../../app/media/media3p/api/useMedia3pApi');
jest.mock('../../../shared/libraryMoveable', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

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

const createMediaResource = (id, name, provider) =>
  createResource({
    id,
    name,
    isExternal: true,
    baseColor: '#734727',
    alt: `${name} + ${id}`,
    provider,
    src: `http://www.img.com/${id}_1`,
    width: 480,
    height: 640,
    sizes: {
      full: {
        sourceUrl: `http://www.img.com/${id}_full`,
        width: 480,
        height: 640,
        mimeType: 'image/png',
      },
      large: {
        sourceUrl: `http://www.img.com/${id}_large`,
        width: 300,
        height: 200,
        mimeType: 'image/png',
      },
      thumbnail: {
        sourceUrl: `http://www.img.com/${id}_thumbnail`,
        width: 200,
        height: 100,
        mimeType: 'image/png',
      },
    },
    type: 'image',
    mimeType: 'image/png',
    creationDate: '1234',
    attribution: {
      author: {
        displayName: 'Photographer Name',
        url: 'https://author.url',
      },
      registerUsageUrl: 'https://registerUsageUrl.com/register',
    },
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
  selectedProvider: 'PROVIDER_1',
  setSelectedProvider: jest.fn(),
  setSearchTerm: jest.fn(),
  media3p: {
    PROVIDER_1: DEFAULT_PROVIDER_STATE(1),
  },
};

const MEDIA = [];
for (let i = 0; i < 10; i++) {
  MEDIA.push(createMediaResource(i, 'img', 'PROVIDER_1'));
}

/* eslint-disable testing-library/no-node-access, testing-library/no-container */

describe('Media3pPane', () => {
  const insertElement = jest.fn();
  const registerUsage = jest.fn();
  let useMediaResult;

  beforeAll(() => {
    setUpEditorStore();

    useConfig.mockImplementation(() => ({
      capabilities: {
        hasUploadMediaAction: true,
      },
    }));
    useLibrary.mockImplementation((selector) =>
      selector({
        actions: {
          insertElement: insertElement,
        },
      })
    );
    useMedia.mockImplementation(() => useMediaResult);
    useLocalMedia.mockImplementation(() => ({
      isCurrentResourceMuting: jest.fn(() => false),
      isCurrentResourceTrimming: jest.fn(() => false),
      isCurrentResourceTranscoding: jest.fn(() => false),
      isCurrentResourceProcessing: jest.fn(() => false),
      isCurrentResourceUploading: jest.fn(() => false),
    }));
    useMedia3pApi.mockImplementation(() => ({
      actions: {
        registerUsage,
      },
    }));

    // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
    window.HTMLElement.prototype.scrollTo = () => {};
  });

  beforeEach(() => {
    useMediaResult = DEFAULT_USE_MEDIA_RESULT;
  });

  it('should display terms dialog', () => {
    renderWithTheme(<Media3pPane isActive />);

    expect(
      screen.getByText(
        /Your use of stock content is subject to third party terms/
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(
      screen.queryByText(
        'Your use of stock content is subject to third party terms.'
      )
    ).not.toBeInTheDocument();
  });

  it('should render <Media3pPane /> with no media', () => {
    renderWithTheme(<Media3pPane isActive />);

    expect(screen.queryByText('No media found.')).not.toBeInTheDocument();
    expect(getComputedStyle(screen.queryByText('Trending')).display).toBe(
      'none'
    );
  });

  it('should render "No media found" text once loading is completed', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = false;
    renderWithTheme(<Media3pPane isActive />);

    expect(screen.getByText('No media found.')).toBeInTheDocument();
    expect(getComputedStyle(screen.queryByText('Trending')).display).toBe(
      'none'
    );
  });

  it('should render <Media3pPane /> with no "Trending" text while media is being loaded', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = false;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = true;
    useMediaResult.media3p.PROVIDER_1.state.media = [];
    renderWithTheme(<Media3pPane isActive />);

    expect(getComputedStyle(screen.queryByText('Trending')).display).toBe(
      'none'
    );
  });

  it('should render <Media3pPane /> with the "Trending" text while a new page is being loaded', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = false;
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoading = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    renderWithTheme(<Media3pPane isActive />);

    expect(getComputedStyle(screen.queryByText('Trending')).display).not.toBe(
      'none'
    );
  });

  it('should render <Media3pPane /> with the "Trending" text', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    renderWithTheme(<Media3pPane isActive />);

    expect(getComputedStyle(screen.queryByText('Trending')).display).not.toBe(
      'none'
    );
  });

  it('should render <Media3pPane /> with enabled search when a category is not selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    const { container } = renderWithTheme(<Media3pPane isActive />);

    expect(container.querySelector('input')).toBeEnabled();
  });

  it('should render <Media3pPane /> with the "Search Results" text', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    useMediaResult.searchTerm = 'cats';
    renderWithTheme(<Media3pPane isActive />);

    const subHeading = screen.getByTestId('media-subheading');

    expect(getComputedStyle(subHeading).display).not.toBe('none');
    expect(subHeading).toHaveTextContent('Search Results');
  });

  it('should render <Media3pPane /> with disabled search when a category is selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    useMediaResult.selectedProvider = 'PROVIDER_1';
    useMediaResult.media3p.PROVIDER_1.state.categories.selectedCategoryId =
      'provider1/1';
    const { container } = renderWithTheme(<Media3pPane isActive />);

    expect(container.querySelector('input')).toBeDisabled();
  });

  it('should render <Media3pPane /> with the category display name when selected', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    useMediaResult.searchTerm = '';
    renderWithTheme(<Media3pPane isActive />);

    const subHeading = screen.getByTestId('media-subheading');

    expect(getComputedStyle(subHeading).display).not.toBe('none');
    expect(subHeading).toHaveTextContent('1 Dogs');
  });

  it('should register usage when inserting media3p resource', () => {
    useMediaResult.media3p.PROVIDER_1.state.isMediaLoaded = true;
    useMediaResult.media3p.PROVIDER_1.state.media = MEDIA;
    useMediaResult.searchTerm = '';
    renderWithTheme(<Media3pPane isActive />);

    fireEvent.click(
      screen.queryAllByRole('button', { name: 'Open insertion menu' })[0]
    );

    fireEvent.click(screen.getByText(/Insert image/));

    expect(registerUsage).toHaveBeenCalledWith({
      registerUsageUrl: 'https://registerUsageUrl.com/register',
    });
  });
});

/* eslint-enable testing-library/no-node-access, testing-library/no-container */
