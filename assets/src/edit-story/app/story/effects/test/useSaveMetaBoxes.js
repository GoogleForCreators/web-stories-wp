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
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import APIContext from '../../../api/context';
import ConfigContext from '../../../config/context';
import useSaveMetaBoxes from '../useSaveMetaBoxes';
import { MetaBoxesProvider } from '../../../../integrations/wordpress/metaBoxes';

const saveMetaBoxes = jest.fn().mockResolvedValue(true);

const apiContextValue = { actions: { saveMetaBoxes } };

const render = ({ configValue, isEnabled, ...initialProps }) => {
  return renderHook(
    ({ story, isSaving, isAutoSaving }) =>
      useSaveMetaBoxes({ story, isSaving, isAutoSaving }),
    {
      initialProps: { ...initialProps },
      // eslint-disable-next-line react/display-name, react/prop-types
      wrapper: ({ children }) => (
        <FlagsProvider features={{ customMetaBoxes: isEnabled }}>
          <ConfigContext.Provider value={configValue}>
            <APIContext.Provider value={apiContextValue}>
              <MetaBoxesProvider>{children}</MetaBoxesProvider>
            </APIContext.Provider>
          </ConfigContext.Provider>
        </FlagsProvider>
      ),
    }
  );
};

describe('useSaveMetaBoxes', () => {
  afterEach(() => {
    saveMetaBoxes.mockReset();
  });

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
    };

    const story = { id: 123 };

    const hookProps = {
      story,
      isSaving: true,
      isAutoSaving: false,
    };

    const { result, rerender, waitForNextUpdate } = render({
      configValue,
      isEnabled: true,
      ...hookProps,
    });

    expect(result.current.isSavingMetaBoxes).toBeFalse();

    rerender({ ...hookProps, isSaving: false });

    expect(result.current.isSavingMetaBoxes).toBeTrue();
    await waitForNextUpdate();
    expect(result.current.isSavingMetaBoxes).toBeFalse();

    expect(saveMetaBoxes).toHaveBeenCalledWith(story, expect.any(FormData));
    expect(Object.fromEntries(saveMetaBoxes.mock.calls[0][1])).toStrictEqual({
      'advanced-metabox-input-value': 'Advanced Data',
      'normal-metabox-input-value': 'Normal Data',
    });
  });
});
