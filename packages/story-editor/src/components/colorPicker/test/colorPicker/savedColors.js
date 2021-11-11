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
import { createSolid } from '@web-stories-wp/patterns';
import { waitFor, act, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { areAllType } from '../../../../utils/presetUtils';
import { arrange } from './_utils';

const mockSavedColors = jest
  .fn()
  .mockImplementation(() => [
    TEAL_COLOR,
    PINK_COLOR,
    SEMIPINK_COLOR,
    OPAQUEGRAD_COLOR,
    SEMIGRAD_COLOR,
  ]);
const mockUpdateStory = jest.fn();

jest.mock(
  '../../../../app/story/useStory',
  () => (cb) =>
    cb({
      state: {
        story: {
          globalStoryStyles: {
            colors: mockSavedColors(),
          },
          selectedElements: [],
        },
      },
      actions: {
        updateStory: mockUpdateStory,
      },
    })
);

jest.mock('../../../../utils/presetUtils');

const TEAL_COLOR = createSolid(0, 255, 255);
const PINK_COLOR = createSolid(255, 0, 255);
const PINK_LABEL = '#f0f';
const SEMIPINK_COLOR = createSolid(255, 0, 255, 0.3);
const SEMIPINK_LABEL = 'rgba(255,0,255,0.3)';
const OPAQUEGRAD_COLOR = {
  type: 'linear',
  stops: [
    { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0 },
    { color: { r: 255, g: 0, b: 255, a: 1 }, position: 1 },
  ],
};
const OPAQUEGRAD_LABEL = 'linear-gradient(0.5turn, #0f0 0%, #f0f 100%)';
const SEMIGRAD_COLOR = {
  type: 'linear',
  stops: [
    { color: { r: 0, g: 255, b: 0, a: 1 }, position: 0 },
    { color: { r: 255, g: 0, b: 255, a: 1 }, position: 1 },
  ],
  alpha: 0.3,
};
const SEMIGRAD_LABEL =
  'linear-gradient(0.5turn, rgba(0,255,0,0.3) 0%, rgba(255,0,255,0.3) 100%)';

describe('<ColorPicker /> and saved colors', () => {
  beforeEach(() => {
    areAllType.mockImplementation(() => true);
  });

  it('should not display saved colors on load if not enabled', () => {
    const { getSwatchList } = arrange({
      color: PINK_COLOR,
    });

    expect(getSwatchList('Saved colors')).not.toBeInTheDocument();
  });

  it('should display saved colors on load if enabled and highlight the current one', () => {
    const { getSwatchList, getSwatches, getSelectedSwatch } = arrange({
      allowsSavedColors: true,
      color: PINK_COLOR,
    });

    expect(getSwatchList('Saved colors')).toBeInTheDocument();
    expect(getSwatches('Saved colors')).toHaveLength(5);
    expect(getSelectedSwatch('Saved colors')).toHaveAccessibleName(PINK_LABEL);
  });

  it('should disable semitransparents and gradients unless allowed', () => {
    const { rerender, getEnabledSwatches, getSwatchByLabel } = arrange({
      allowsSavedColors: true,
      allowsGradient: false,
      allowsOpacity: false,
    });

    // Both the semitransparent and the gradients are disabled
    expect(getEnabledSwatches('Saved colors')).toHaveLength(2);
    expect(getSwatchByLabel('Saved colors', SEMIPINK_LABEL)).toBeDisabled();
    expect(getSwatchByLabel('Saved colors', OPAQUEGRAD_LABEL)).toBeDisabled();
    expect(getSwatchByLabel('Saved colors', SEMIGRAD_LABEL)).toBeDisabled();

    // If enabling only transparency, both gradients are still disabled
    rerender({ allowsOpacity: true });
    expect(getEnabledSwatches('Saved colors')).toHaveLength(3);
    expect(getSwatchByLabel('Saved colors', SEMIPINK_LABEL)).toBeEnabled();
    expect(getSwatchByLabel('Saved colors', OPAQUEGRAD_LABEL)).toBeDisabled();
    expect(getSwatchByLabel('Saved colors', SEMIGRAD_LABEL)).toBeDisabled();

    // If enabling only gradients, both the semitransparents are disabled
    rerender({ allowsGradient: true });
    expect(getEnabledSwatches('Saved colors')).toHaveLength(3);
    expect(getSwatchByLabel('Saved colors', SEMIPINK_LABEL)).toBeDisabled();
    expect(getSwatchByLabel('Saved colors', OPAQUEGRAD_LABEL)).toBeEnabled();
    expect(getSwatchByLabel('Saved colors', SEMIGRAD_LABEL)).toBeDisabled();

    // If enabling both, none are disabled
    rerender({ allowsOpacity: true, allowsGradient: true });
    expect(getEnabledSwatches('Saved colors')).toHaveLength(5);
    expect(getSwatchByLabel('Saved colors', SEMIPINK_LABEL)).toBeEnabled();
    expect(getSwatchByLabel('Saved colors', OPAQUEGRAD_LABEL)).toBeEnabled();
    expect(getSwatchByLabel('Saved colors', SEMIGRAD_LABEL)).toBeEnabled();
  });

  it('should not add the same custom color twice', async () => {
    const { getCustomButton, getAddCustomButton, getEditableAlphaElement } =
      arrange({
        allowsSavedColors: true,
        allowsOpacity: true,
        color: TEAL_COLOR,
      });

    act(() => {
      fireEvent.click(getCustomButton());
    });

    // Wait for the lazy-loaded module
    await waitFor(() => expect(getEditableAlphaElement()).toBeInTheDocument());

    // Click to save the color that already exists.
    fireEvent.click(getAddCustomButton());

    // Verify the TEAL color that was already saved wasn't added a second time.
    expect(mockUpdateStory).toHaveBeenCalledWith({
      properties: {
        globalStoryStyles: {
          colors: [
            TEAL_COLOR,
            PINK_COLOR,
            SEMIPINK_COLOR,
            OPAQUEGRAD_COLOR,
            SEMIGRAD_COLOR,
          ],
        },
      },
    });
  });

  it('should invoke updateStory with the added color when adding one', async () => {
    const { getCustomButton, getAddCustomButton, getEditableAlphaElement } =
      arrange({
        allowsSavedColors: true,
        allowsOpacity: true,
        color: TEAL_COLOR,
      });

    act(() => {
      fireEvent.click(getCustomButton());
    });

    // Wait for the lazy-loaded module
    await waitFor(() => expect(getEditableAlphaElement()).toBeInTheDocument());
    // Click to enable and focus input
    fireEvent.click(getEditableAlphaElement());
    // Wait for input to be present
    await waitFor(() => expect(getEditableAlphaElement()).toBeInTheDocument());
    // Adjust the opacity to 50%
    fireEvent.change(getEditableAlphaElement(), { target: { value: '50' } });

    // Click to save
    fireEvent.click(getAddCustomButton());

    expect(mockUpdateStory).toHaveBeenCalledWith({
      properties: {
        globalStoryStyles: {
          colors: expect.arrayContaining([
            {
              // This matches TEAL at 50% opacity
              color: { r: 0, g: 255, b: 255, a: 0.5 },
            },
          ]),
        },
      },
    });
  });
});
