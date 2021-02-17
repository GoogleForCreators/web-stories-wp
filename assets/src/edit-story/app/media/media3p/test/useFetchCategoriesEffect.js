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
import useFetchCategoriesEffect from '../useFetchCategoriesEffect';

const mockListCategories = jest.fn();

jest.mock('../api', () => ({
  useMedia3pApi: () => ({
    actions: {
      listCategories: mockListCategories,
    },
  }),
}));

const mockShowSnackbar = jest.fn();
jest.mock('../../../snackbar', () => ({
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

describe('useFetchCategoriesEffect', () => {
  let fetchCategoriesStart;
  let fetchCategoriesSuccess;
  let fetchCategoriesError;

  beforeEach(() => {
    mockListCategories.mockReset();
    fetchCategoriesStart = jest.fn();
    fetchCategoriesSuccess = jest.fn();
    fetchCategoriesError = jest.fn();
    mockShowSnackbar.mockReset();
  });

  function renderUseFetchCategoriesEffect(propertyOverrides) {
    act(() => {
      renderHook(() => {
        useFetchCategoriesEffect({
          provider: 'unsplash',
          selectedProvider: 'unsplash',
          fetchCategoriesStart,
          fetchCategoriesSuccess,
          fetchCategoriesError,
          ...propertyOverrides,
        });
      });
    });
  }

  it('should fetch categories when the provider is set', async () => {
    mockListCategories.mockImplementation(() =>
      Promise.resolve({
        categories: [
          {
            name: 'categories/unsplash:c7USHrQ0Ljw',
            label: 'COVID-19',
          },
        ],
      })
    );

    await renderUseFetchCategoriesEffect();

    expect(fetchCategoriesStart.mock.calls).toHaveLength(1);
    expect(fetchCategoriesStart.mock.calls[0][0]).toStrictEqual(
      expect.objectContaining({ provider: 'unsplash' })
    );

    expect(fetchCategoriesSuccess.mock.calls).toHaveLength(1);
    expect(fetchCategoriesSuccess.mock.calls[0][0]).toStrictEqual(
      expect.objectContaining({
        provider: 'unsplash',
        categories: [
          {
            name: 'categories/unsplash:c7USHrQ0Ljw',
            label: 'COVID-19',
          },
        ],
      })
    );
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should call fetchCategoriesError if the fetch has failed', async () => {
    mockListCategories.mockImplementation(() => Promise.error(new Error()));

    await renderUseFetchCategoriesEffect();

    expect(fetchCategoriesStart.mock.calls).toHaveLength(1);
    expect(fetchCategoriesSuccess.mock.calls).toHaveLength(0);
    expect(fetchCategoriesError.mock.calls).toHaveLength(1);
    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
  });

  it('should not fetch media if the provider is not the same as selected provider', async () => {
    await renderUseFetchCategoriesEffect({
      provider: 'coverr',
      selectedProvider: 'unsplash',
    });
    expect(fetchCategoriesStart).not.toHaveBeenCalledTimes(1);
    expect(fetchCategoriesSuccess).not.toHaveBeenCalledTimes(1);
    expect(fetchCategoriesError).not.toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });
});
