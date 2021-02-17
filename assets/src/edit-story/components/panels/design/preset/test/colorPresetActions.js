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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import ColorPresetActions from '../colorPreset/colorPresetActions';
import { renderWithTheme } from '../../../../../testUtils';

function setupActions() {
  const updateStory = jest.fn();
  const pushUpdate = jest.fn();

  const textElement = {
    id: '1',
    type: 'text',
  };
  const storyContextValue = {
    state: {
      selectedElements: [textElement],
      story: {
        globalStoryStyles: { colors: [] },
        currentStoryStyles: { colors: [] },
      },
      currentPage: {
        elements: [
          {
            id: 'bg',
            type: 'shape',
          },
          textElement,
        ],
      },
    },
    actions: { updateStory },
  };
  const { getByRole } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <ColorPresetActions
        color={{ color: { r: 1, g: 1, b: 1 } }}
        pushUpdate={pushUpdate}
      />
    </StoryContext.Provider>
  );
  return {
    getByRole,
    updateStory,
  };
}

describe('Panels/StylePreset/ColorPresetActions', () => {
  const ADD_PRESET = 'Add color';

  it('should render color preset actions', () => {
    const { getByRole } = setupActions();
    const element = getByRole('button', { name: ADD_PRESET });
    expect(element).toBeInTheDocument();
  });

  it('should update color presets', () => {
    const { getByRole, updateStory } = setupActions();
    const element = getByRole('button', { name: ADD_PRESET });
    fireEvent.click(element);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        currentStoryStyles: {
          colors: [{ color: { b: 1, g: 1, r: 1 } }],
        },
      },
    });
  });
});
