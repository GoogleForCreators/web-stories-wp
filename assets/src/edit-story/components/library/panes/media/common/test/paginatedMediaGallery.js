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
    const { queryByTestId } = renderWithTheme(
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
    expect(queryByTestId('attribution')).toBeDefined();
    expect(queryByTestId('loading-pill')).toBeNull();
  });

  it('should render the loading pill when media is loading', () => {
    const { queryByTestId } = renderWithTheme(
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
    expect(queryByTestId('loading-pill')).toBeDefined();
    expect(queryByTestId('attribution')).toBeNull();
  });
});
