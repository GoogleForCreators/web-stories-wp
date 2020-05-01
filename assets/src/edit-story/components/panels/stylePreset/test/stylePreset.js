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
import StylePresetPanel from '../index';
import StoryContext from '../../../../app/story/context';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel(extraStylePresets, extraStateProps) {
  const updateStory = jest.fn();
  const updateElementsById = jest.fn();

  const textElement = {
    id: '1',
    type: 'text',
  };
  const storyContextValue = {
    state: {
      selectedElementIds: ['1'],
      selectedElements: [textElement],
      ...extraStateProps,
      story: {
        stylePresets: {
          ...{ fillColors: [], textColors: [] },
          ...extraStylePresets,
        },
      },
    },
    actions: { updateStory, updateElementsById },
  };
  const {
    getByText,
    queryByLabelText,
    getByLabelText,
    queryByText,
  } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <StylePresetPanel />
    </StoryContext.Provider>
  );
  return {
    getByText,
    queryByText,
    getByLabelText,
    queryByLabelText,
    updateStory,
    updateElementsById,
  };
}

describe('Panels/StylePreset', () => {
  const EDIT_BUTTON_LABEL = 'Edit presets';
  const TEST_COLOR = {
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
  };

  it('should render <StylePresetPanel /> panel', () => {
    const { getByText } = setupPanel();
    const element = getByText('Style presets');
    expect(element).toBeDefined();
  });

  it('should display only Add button if no presets exist', () => {
    const { queryByLabelText } = setupPanel();
    const addButton = queryByLabelText('Add preset');
    expect(addButton).toBeDefined();

    const editButton = queryByLabelText(EDIT_BUTTON_LABEL);
    expect(editButton).toBeNull();
  });

  it('should have functional Edit button if relevant presets exist', () => {
    const extraStylePresets = {
      textColors: [TEST_COLOR],
    };
    const { getByLabelText } = setupPanel(extraStylePresets);
    const editButton = getByLabelText(EDIT_BUTTON_LABEL);
    expect(editButton).toBeDefined();

    fireEvent.click(editButton);
    const exitEditModeButton = getByLabelText('Exit edit mode');
    expect(exitEditModeButton).toBeDefined();
  });

  it('should display correct label for Text colors', () => {
    const extraStylePresets = {
      textColors: [TEST_COLOR],
    };
    const { getByText } = setupPanel(extraStylePresets);
    const groupLabel = getByText('Text colors');
    expect(groupLabel).toBeDefined();
  });

  it('should display correct label for Colors', () => {
    const extraStylePresets = {
      fillColors: [TEST_COLOR],
    };
    const extraStateProps = {
      selectedElements: [
        {
          id: '1',
          type: 'shape',
        },
      ],
    };
    const { getByText, queryByText } = setupPanel(
      extraStylePresets,
      extraStateProps
    );
    const groupLabel = getByText('Colors');
    expect(groupLabel).toBeDefined();

    const textColorGroupLabel = queryByText('Text colors');
    expect(textColorGroupLabel).toBeNull();
  });

  it('should allow deleting the relevant preset', () => {
    const extraStylePresets = {
      textColors: [TEST_COLOR],
      fillColors: [TEST_COLOR],
    };
    const { getByLabelText, updateStory } = setupPanel(extraStylePresets);
    const editButton = getByLabelText(EDIT_BUTTON_LABEL);
    fireEvent.click(editButton);

    const deletePreset = getByLabelText('Delete preset');
    expect(deletePreset).toBeDefined();

    fireEvent.click(deletePreset);
    expect(updateStory).toHaveBeenCalledTimes(1);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        stylePresets: { fillColors: [TEST_COLOR], textColors: [] },
      },
    });
  });

  it('should allow applying presets for shapes', () => {
    const extraStylePresets = {
      fillColors: [TEST_COLOR],
    };
    const extraStateProps = {
      selectedElements: [
        {
          id: '1',
          type: 'shape',
        },
      ],
    };
    const { getByLabelText, updateElementsById } = setupPanel(
      extraStylePresets,
      extraStateProps
    );

    const applyPreset = getByLabelText('Apply preset');
    expect(applyPreset).toBeDefined();

    fireEvent.click(applyPreset);
    expect(updateElementsById).toHaveBeenCalledTimes(1);
    expect(updateElementsById).toHaveBeenCalledWith({
      elementIds: ['1'],
      properties: expect.any(Function),
    });
  });

  it('should allow applying presets for text', () => {
    const extraStylePresets = {
      textColors: [TEST_COLOR],
    };
    const { getByLabelText, updateElementsById } = setupPanel(
      extraStylePresets
    );

    const applyPreset = getByLabelText('Apply preset');
    expect(applyPreset).toBeDefined();

    fireEvent.click(applyPreset);
    expect(updateElementsById).toHaveBeenCalledTimes(1);
    expect(updateElementsById).toHaveBeenCalledWith({
      elementIds: ['1'],
      properties: {
        color: TEST_COLOR,
      },
    });
  });
  // @TODO More tests to be added once the feature is complete.
});
