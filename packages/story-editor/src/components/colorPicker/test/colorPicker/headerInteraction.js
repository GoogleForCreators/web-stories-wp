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
import { fireEvent, waitFor } from '@testing-library/react';
import { createSolid } from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { arrange } from './_utils';

jest.mock(
  '../../../../app/story/useStory',
  () => (cb) =>
    cb({
      state: {
        story: {
          globalStoryStyles: {
            colors: [],
          },
          selectedElements: [],
        },
      },
      actions: {
        updateStory: jest.fn(),
      },
    })
);

describe('<ColorPicker /> as the header is interacted with', () => {
  it('should invoke onchange with new correct pattern when switching to linear', async () => {
    const { getCustomButton, getLinearButton, onChange } = arrange({
      color: createSolid(0, 0, 255),
      allowsGradient: true,
    });

    fireEvent.click(getCustomButton());
    fireEvent.click(getLinearButton());

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        rotation: 0.5,
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'linear',
      })
    );
  });

  it('should invoke onchange with new correct pattern when switching to radial', async () => {
    const { getCustomButton, getRadialButton, onChange } = arrange({
      color: createSolid(0, 0, 255),
      allowsGradient: true,
    });

    fireEvent.click(getCustomButton());
    fireEvent.click(getRadialButton());

    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'radial',
      })
    );
  });

  it('should display gradient line only if switching to non-solid pattern', async () => {
    const {
      getCustomButton,
      getGradientLine,
      getSolidButton,
      getLinearButton,
    } = arrange({
      color: createSolid(0, 0, 0),
      allowsGradient: true,
    });

    fireEvent.click(getCustomButton());

    await waitFor(() => expect(getGradientLine()).not.toBeInTheDocument());
    fireEvent.click(getLinearButton());
    expect(getGradientLine()).toBeInTheDocument();
    fireEvent.click(getSolidButton());
    expect(getGradientLine()).not.toBeInTheDocument();
  });
});
