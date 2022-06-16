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
import { renderHook, waitFor } from '@testing-library/react';
import { ConfigContext } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import useSaveMetaBoxes from '../useSaveMetaBoxes';
import MetaBoxesProvider from '../metaBoxesProvider';
import useMetaBoxes from '../useMetaBoxes';

const render = ({ configValue, isEnabled, ...initialProps }) => {
  return renderHook(
    ({ story, isSavingStory, isAutoSavingStory }) => {
      useSaveMetaBoxes({ story, isSavingStory, isAutoSavingStory });
      return useMetaBoxes();
    },
    {
      initialProps: { ...initialProps },
      wrapper: ({ children }) => (
        <ConfigContext.Provider value={configValue}>
          <MetaBoxesProvider>{children}</MetaBoxesProvider>
        </ConfigContext.Provider>
      ),
    }
  );
};

describe('useSaveMetaBoxes', () => {
  it('saves meta box form data', async () => {
    const baseFormElement = document.createElement('form');
    baseFormElement.className = 'metabox-base-form';

    // "Normal" meta box area with 1 meta box.

    const normalWrapper = document.createElement('div');
    normalWrapper.className = 'web-stories-meta-boxes-area-normal';

    const normalLocation = document.createElement('form');
    normalLocation.className = 'metabox-location-normal';
    normalWrapper.appendChild(normalLocation);

    const normalMetaBoxInput = document.createElement('input');
    normalMetaBoxInput.name = 'normal-metabox-input-value';
    normalMetaBoxInput.value = 'Normal Data';
    normalLocation.appendChild(normalMetaBoxInput);

    // "Advanced" meta box area with 1 meta box.

    const advancedWrapper = document.createElement('div');
    advancedWrapper.className = 'web-stories-meta-boxes-area-advanced';

    const advancedLocation = document.createElement('form');
    advancedLocation.className = 'metabox-location-advanced';
    advancedWrapper.appendChild(advancedLocation);

    const advancedMetaBoxInput = document.createElement('input');
    advancedMetaBoxInput.name = 'advanced-metabox-input-value';
    advancedMetaBoxInput.value = 'Advanced Data';
    advancedLocation.appendChild(advancedMetaBoxInput);

    document.body.appendChild(baseFormElement);
    document.body.appendChild(normalWrapper);
    document.body.appendChild(advancedWrapper);

    const configValue = {
      metaBoxes: {
        normal: [{}],
        advanced: [{}],
      },
      api: {
        metaBoxes:
          'http://localhost:10003/wp-admin/post.php?post=5&action=edit&meta-box-loader=1&meta-box-loader-nonce=d19ae41860',
      },
    };

    const story = { id: 123 };

    const hookProps = {
      story,
      isSavingStory: true,
      isAutoSavingStory: false,
    };

    const { rerender, result } = render({
      configValue,
      isEnabled: true,
      ...hookProps,
    });

    expect(result.current.state.isSavingMetaBoxes).toBeFalse();
    rerender({ ...hookProps, isSavingStory: false });

    expect(result.current.state.isSavingMetaBoxes).toBeTrue();
    await waitFor(() => {
      expect(result.current.state.isSavingMetaBoxes).toBeFalse();
    });
  });
});
