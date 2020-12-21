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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../../../testUtils';
import PaginatedMediaGallery from '../paginatedMediaGallery';

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
      title: 'A cat',
      type: 'image',
      width: 530,
    },
  ];

  beforeAll(() => {
    // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
    window.HTMLElement.prototype.scrollTo = () => {};
  });

  it('should render attribution when media is present', () => {
    const { queryByTestId, queryByText } = renderWithTheme(
      <PaginatedMediaGallery
        providerType={providerType}
        resources={resources}
        isMediaLoading={false}
        isMediaLoaded={true}
        hasMore={false}
        onInsert={() => {}}
        setNextPage={() => {}}
      />
    );

    expect(queryByText(/Powered by/)).toBeInTheDocument();
    expect(queryByTestId('loading-pill')).not.toBeInTheDocument();
  });

  it('should render the loading pill when media is loading', async () => {
    const { queryByTestId, queryByText } = renderWithTheme(
      <PaginatedMediaGallery
        providerType={providerType}
        resources={resources}
        isMediaLoading={true}
        isMediaLoaded={false}
        hasMore={true}
        onInsert={() => {}}
        setNextPage={() => {}}
      />
    );

    expect(queryByText(/Powered by/)).toBeInTheDocument();
    expect(queryByTestId('loading-pill')).not.toBeInTheDocument();

    // The loading indicator only appears (and thus the attribution disappears)
    // if loading takes too long.
    await waitFor(
      () => {
        expect(queryByText(/Powered by/)).not.toBeInTheDocument();
        expect(queryByText(/Powered by/)).not.toBeInTheDocument();
      },
      {
        timeout: 1000,
      }
    );
  });
});
