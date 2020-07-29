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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import { Simulate } from 'react-dom/test-utils';
import MediaElement from '../panes/media/common/mediaElement';
import { ProviderType } from '../panes/media/common/providerType';
import { renderWithTheme } from '../../../testUtils';

const renderMediaElement = (resource, providerType) =>
  renderWithTheme(
    <FlagsProvider features={{ mediaDropdownMenu: true }}>
      <MediaElement
        resource={resource}
        onInsert={() => {}}
        providerType={providerType}
      />
    </FlagsProvider>
  );

describe('MediaElement', () => {
  it("should render dropdown menu's more icon for uploaded image", () => {
    const resource = {
      id: 123,
      src: 'http://image-url.com',
      type: 'image',
      width: 100,
      height: 100,
      local: false, // Already uploaded
      alt: 'image :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      ProviderType.LOCAL
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('image :)');
    Simulate.focus(element);

    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should render dropdown menu's more icon for uploaded video", () => {
    const resource = {
      id: 456,
      src: 'http://video-url.com',
      type: 'video',
      width: 100,
      height: 100,
      local: false, // Already uploaded
      alt: 'video :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      ProviderType.LOCAL
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('video :)');
    Simulate.focus(element);

    expect(getByAriaLabel('More')).toBeInTheDocument();
  });

  it("should not render dropdown menu's more icon for not uploaded image", () => {
    const resource = {
      id: 789,
      src: 'http://image-url.com',
      type: 'image',
      width: 100,
      height: 100,
      local: true, // Not yet uploaded
      alt: 'image :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      ProviderType.LOCAL
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('image :)');
    Simulate.focus(element);

    expect(queryByAriaLabel('More')).not.toBeInTheDocument();
  });

  it("should not render dropdown menu's more icon for not uploaded video", () => {
    const resource = {
      id: 987,
      src: 'http://video-url.com',
      type: 'video',
      width: 100,
      height: 100,
      local: true, // Not yet uploaded
      alt: 'video :)',
    };

    const { getByAriaLabel, queryByAriaLabel } = renderMediaElement(
      resource,
      ProviderType.LOCAL
    );
    expect(queryByAriaLabel('More')).not.toBeInTheDocument();

    const element = getByAriaLabel('video :)');
    Simulate.focus(element);

    expect(queryByAriaLabel('More')).not.toBeInTheDocument();
  });
});
