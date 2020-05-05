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
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { getShapePresets, getTextPresets } from '../utils';
import { renderWithTheme } from '../../../../testUtils';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';
jest.mock('../utils');

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
          ...{ fillColors: [], textColors: [], textStyles: [] },
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
    queryAllByLabelText,
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
    queryAllByLabelText,
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
  const TEST_COLOR_2 = {
    color: {
      r: 2,
      g: 2,
      b: 2,
    },
  };
  const STYLE_PRESET = {
    color: TEST_COLOR_2,
    backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
    backgroundColor: TEST_COLOR,
  };

  it('should render <StylePresetPanel /> panel', () => {
    const { getByText } = setupPanel();
    const element = getByText('Presets');
    expect(element).toBeDefined();
  });

  it('should not display the panel if mixed types multi-selection', () => {
    const extraStateProps = {
      selectedElements: [
        {
          id: '1',
          type: 'text',
        },
        {
          id: '2',
          type: 'shape',
        },
      ],
    };
    const { queryByText } = setupPanel(null, extraStateProps);
    expect(queryByText('Presets')).toBeNull();
  });

  describe('Panels/StylePreset/Header', () => {
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
      const { getByLabelText, queryByLabelText } = setupPanel(
        extraStylePresets
      );
      const editButton = getByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).toBeDefined();

      fireEvent.click(editButton);
      const exitEditModeButton = getByLabelText('Exit edit mode');
      expect(exitEditModeButton).toBeDefined();
      expect(queryByLabelText(EDIT_BUTTON_LABEL)).toBeNull();

      fireEvent.click(exitEditModeButton);
      const newEditButton = getByLabelText(EDIT_BUTTON_LABEL);
      expect(newEditButton).toBeDefined();
    });

    it('should add a text color preset', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'text',
            color: [TEST_COLOR_2],
            backgroundTextMode: BACKGROUND_TEXT_MODE.NONE,
            font: TEXT_ELEMENT_DEFAULT_FONT,
          },
        ],
      };
      const { updateStory, queryByLabelText } = setupPanel(
        null,
        extraStateProps
      );

      getTextPresets.mockImplementation(() => {
        return {
          textColors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            textColors: [TEST_COLOR_2],
            fillColors: [],
            textStyles: [],
          },
        },
      });
    });

    it('should add style preset from a Text with correct values', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'text',
            ...STYLE_PRESET,
          },
        ],
      };
      const { updateStory, queryByLabelText } = setupPanel(
        null,
        extraStateProps
      );

      getTextPresets.mockImplementation(() => {
        return {
          textStyles: [STYLE_PRESET],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            textColors: [],
            fillColors: [],
            textStyles: [STYLE_PRESET],
          },
        },
      });
    });

    it('should allow adding presets from shapes', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'shape',
            backgroundColor: [TEST_COLOR_2],
          },
        ],
      };
      const { updateStory, queryByLabelText } = setupPanel(
        null,
        extraStateProps
      );

      getShapePresets.mockImplementation(() => {
        return {
          fillColors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            textColors: [],
            fillColors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });
    });
  });

  describe('Panels/StylePreset/Colors', () => {
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

    it('should allow deleting the relevant color preset', () => {
      const extraStylePresets = {
        textColors: [TEST_COLOR, TEST_COLOR_2],
        fillColors: [TEST_COLOR],
      };
      const { getByLabelText, queryAllByLabelText, updateStory } = setupPanel(
        extraStylePresets
      );
      const editButton = getByLabelText(EDIT_BUTTON_LABEL);
      fireEvent.click(editButton);

      const deletePresets = queryAllByLabelText('Delete color preset');
      expect(deletePresets[0]).toBeDefined();

      fireEvent.click(deletePresets[0]);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            fillColors: [TEST_COLOR],
            textColors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });
    });

    it('should allow applying color presets for shapes', () => {
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

      const applyPreset = getByLabelText('Apply color preset');
      expect(applyPreset).toBeDefined();

      fireEvent.click(applyPreset);
      expect(updateElementsById).toHaveBeenCalledTimes(1);
      expect(updateElementsById).toHaveBeenCalledWith({
        elementIds: ['1'],
        properties: {
          backgroundColor: TEST_COLOR,
        },
      });
    });

    it('should allow applying color presets for text', () => {
      const extraStylePresets = {
        textColors: [TEST_COLOR],
      };
      const { getByLabelText, updateElementsById } = setupPanel(
        extraStylePresets
      );

      const applyPreset = getByLabelText('Apply color preset');
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
  });
});
