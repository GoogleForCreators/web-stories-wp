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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useFetchMediaEffect from '../useFetchMediaEffect';

const mockListMedia = jest.fn();

jest.mock('../api', () => ({
  useMedia3pApi: () => ({
    actions: {
      listMedia: mockListMedia,
    },
  }),
}));

const mockShowSnackbar = jest.fn();
jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

describe('useFetchMediaEffect', () => {
  let fetchMediaStart;
  let fetchMediaSuccess;
  let fetchMediaError;
  let consoleErrorFn;

  beforeEach(() => {
    consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockListMedia.mockReset();
    fetchMediaStart = jest.fn();
    fetchMediaSuccess = jest.fn();
    fetchMediaError = jest.fn();
    mockShowSnackbar.mockReset();
  });

  afterEach(() => {
    consoleErrorFn.mockRestore();
  });

  function renderUseFetchMediaEffect(propertyOverrides) {
    act(() => {
      renderHook(() => {
        useFetchMediaEffect({
          provider: 'unsplash',
          selectedProvider: 'unsplash',
          pageToken: undefined,
          isMediaLoaded: false,
          isMediaLoading: false,
          fetchMediaStart,
          fetchMediaSuccess,
          fetchMediaError,
          ...propertyOverrides,
        });
      });
    });
  }

  it('should fetch media when the provider is set and not search term', async () => {
    mockListMedia.mockImplementation(() =>
      Promise.resolve({ media: [{ id: 1 }], nextPageToken: 'nextPageToken' })
    );

    await renderUseFetchMediaEffect();

    expect(fetchMediaStart).toHaveBeenCalledWith({
      provider: 'unsplash',
      pageToken: undefined,
    });
    expect(mockListMedia).toHaveBeenCalledWith({
      provider: 'unsplash',
      filter: { searchTerm: undefined },
      pageToken: undefined,
    });
    expect(fetchMediaSuccess).toHaveBeenCalledWith({
      provider: 'unsplash',
      media: [{ id: 1 }],
      nextPageToken: 'nextPageToken',
      pageToken: undefined,
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should fetch media when the provider is set and contentType is filtered', async () => {
    mockListMedia.mockImplementation(() =>
      Promise.resolve({ media: [{ id: 1 }], nextPageToken: 'nextPageToken' })
    );

    await renderUseFetchMediaEffect({
      provider: 'tenor',
      selectedProvider: 'tenor',
    });

    expect(fetchMediaStart).toHaveBeenCalledWith({
      provider: 'tenor',
      pageToken: undefined,
    });
    expect(mockListMedia).toHaveBeenCalledWith({
      provider: 'tenor',
      filter: { contentType: 'gif' },
      pageToken: undefined,
    });
    expect(fetchMediaSuccess).toHaveBeenCalledWith({
      provider: 'tenor',
      media: [{ id: 1 }],
      nextPageToken: 'nextPageToken',
      pageToken: undefined,
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should fetch media when the provider is set and search term', async () => {
    mockListMedia.mockImplementation(() =>
      Promise.resolve({ media: [{ id: 1 }], nextPageToken: 'nextPageToken' })
    );

    await renderUseFetchMediaEffect({ searchTerm: 'cat' });

    expect(fetchMediaStart).toHaveBeenCalledWith({
      provider: 'unsplash',
      pageToken: undefined,
    });
    expect(mockListMedia).toHaveBeenCalledWith({
      provider: 'unsplash',
      filter: { searchTerm: 'cat' },
      pageToken: undefined,
    });
    expect(fetchMediaSuccess).toHaveBeenCalledWith({
      provider: 'unsplash',
      media: [{ id: 1 }],
      nextPageToken: 'nextPageToken',
      pageToken: undefined,
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should fetch media when the provider is set and category id', async () => {
    mockListMedia.mockImplementation(() =>
      Promise.resolve({ media: [{ id: 1 }], nextPageToken: 'nextPageToken' })
    );

    await renderUseFetchMediaEffect({ selectedCategoryId: 'category/1' });

    expect(fetchMediaStart).toHaveBeenCalledWith({
      provider: 'unsplash',
      pageToken: undefined,
    });
    expect(mockListMedia).toHaveBeenCalledWith({
      provider: 'unsplash',
      filter: {
        searchTerm: null,
        categoryId: 'category/1',
      },
      pageToken: undefined,
    });
    expect(fetchMediaSuccess).toHaveBeenCalledWith({
      provider: 'unsplash',
      media: [{ id: 1 }],
      nextPageToken: 'nextPageToken',
      pageToken: undefined,
    });
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should call fetchMediaError if the fetch has failed', async () => {
    mockListMedia.mockImplementation(() => Promise.reject(new Error()));

    await renderUseFetchMediaEffect();

    expect(fetchMediaStart).toHaveBeenCalledOnce();
    expect(fetchMediaSuccess).not.toHaveBeenCalledWith();
    expect(fetchMediaError).toHaveBeenCalledOnce();
    expect(mockShowSnackbar).toHaveBeenCalledOnce();
  });

  it('should not fetch media if the provider is not the same as selected provider', async () => {
    await renderUseFetchMediaEffect({
      provider: 'coverr',
      selectedProvider: 'unsplash',
    });
    expect(fetchMediaStart).not.toHaveBeenCalledOnce();
    expect(fetchMediaSuccess).not.toHaveBeenCalledOnce();
    expect(fetchMediaError).not.toHaveBeenCalledOnce();
    expect(mockShowSnackbar).not.toHaveBeenCalledOnce();
  });
});
