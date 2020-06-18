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
import {
  getShapePresets,
  getTextPresets,
  getPagePreset,
  presetHasOpacity,
} from '../utils';
import { renderWithTheme } from '../../../../testUtils';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../app/font/defaultFonts';
import createSolid from '../../../../utils/createSolid';

jest.mock('../utils');

function setupPanel(extraStylePresets, extraStateProps) {
  const updateStory = jest.fn();
  const updateElementsById = jest.fn();
  const updateCurrentPageProperties = jest.fn();

  const textElement = {
    id: '1',
    type: 'text',
  };
  const storyContextValue = {
    state: {
      currentPage: {
        elements: [
          {
            id: 'bg',
          },
        ],
      },
      selectedElementIds: ['1'],
      selectedElements: [textElement],
      ...extraStateProps,
      story: {
        stylePresets: {
          ...{ colors: [] },
          ...extraStylePresets,
        },
      },
    },
    actions: { updateStory, updateElementsById, updateCurrentPageProperties },
  };
  const {
    getByRole,
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
    getByRole,
    getByText,
    queryByText,
    getByLabelText,
    queryByLabelText,
    queryAllByLabelText,
    updateStory,
    updateElementsById,
    updateCurrentPageProperties,
  };
}

describe('Panels/StylePreset', () => {
  const EDIT_BUTTON_LABEL = 'Edit presets';
  const APPLY_PRESET = 'Apply color preset';
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
  const BACKGROUND_PROPS = {
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
        colors: [TEST_COLOR],
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
            content: '<span style="color: rgb(2, 2, 2)">Content</span>',
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
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            colors: [TEST_COLOR_2],
          },
        },
      });
    });

    it('should add color preset from a Text with correct values when multiple styles have changed', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'text',
            content: '<span style="color: rgba(2, 2, 2, 1)">Content</span>',
            ...BACKGROUND_PROPS,
          },
        ],
      };
      const { updateStory, queryByLabelText } = setupPanel(
        null,
        extraStateProps
      );

      getTextPresets.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            colors: [TEST_COLOR_2],
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
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            colors: [TEST_COLOR_2],
          },
        },
      });
    });

    it('should allow adding preset from the background', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: 'bg',
          },
        ],
      };
      const { updateStory, queryByLabelText } = setupPanel(
        null,
        extraStateProps
      );

      getPagePreset.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = queryByLabelText('Add preset');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          stylePresets: {
            colors: [TEST_COLOR_2],
          },
        },
      });
    });
  });

  describe('Panels/StylePreset/Colors', () => {
    // Disable reason: not implemented for beta.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should display correct label for Text colors', () => {
      const extraStylePresets = {
        textColors: [TEST_COLOR],
      };
      const { getByText } = setupPanel(extraStylePresets);
      const groupLabel = getByText('Text colors');
      expect(groupLabel).toBeDefined();
    });

    it('should display correct label for Colors', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
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
        colors: [TEST_COLOR, TEST_COLOR_2],
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
            colors: [TEST_COLOR_2],
          },
        },
      });
    });

    it('should allow applying color presets for shapes', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
      };
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'shape',
          },
        ],
      };
      const { getByRole, updateElementsById } = setupPanel(
        extraStylePresets,
        extraStateProps
      );

      const applyPreset = getByRole('button', { name: APPLY_PRESET });
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
        colors: [TEST_COLOR],
      };
      const { getByRole, updateElementsById } = setupPanel(extraStylePresets);

      const applyPreset = getByRole('button', { name: APPLY_PRESET });
      expect(applyPreset).toBeDefined();

      fireEvent.click(applyPreset);
      expect(updateElementsById).toHaveBeenCalledTimes(1);
      expect(updateElementsById).toHaveBeenCalledWith({
        elementIds: ['1'],
        properties: expect.any(Function),
      });
      const updaterFunction = updateElementsById.mock.calls[0][0].properties;
      const partiallyBlueContent = {
        content: 'Hello <span style="color: blue">World</span>',
      };
      const updatedContent = updaterFunction(partiallyBlueContent);
      const expectedContent = {
        content: '<span style="color: #010101">Hello World</span>',
      };
      expect(updatedContent).toStrictEqual(expectedContent);
    });

    it('should not apply colors with opacity as Page background', () => {
      const extraStylePresets = {
        colors: [createSolid(1, 1, 1, 0.5)],
      };
      const extraStateProps = {
        selectedElements: [
          {
            id: 'bg',
          },
        ],
      };
      presetHasOpacity.mockImplementation((color) => {
        return Boolean(color.color?.a && color.color.a < 1);
      });
      const { getByRole, updateCurrentPageProperties } = setupPanel(
        extraStylePresets,
        extraStateProps
      );

      const applyPreset = getByRole('button', { name: APPLY_PRESET });
      expect(applyPreset).toBeDefined();

      fireEvent.click(applyPreset);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(0);
    });

    it('should allow applying color preset for Page background', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
      };
      const extraStateProps = {
        selectedElements: [
          {
            id: 'bg',
          },
        ],
      };
      const { getByRole, updateCurrentPageProperties } = setupPanel(
        extraStylePresets,
        extraStateProps
      );

      const applyPreset = getByRole('button', { name: APPLY_PRESET });
      expect(applyPreset).toBeDefined();

      fireEvent.click(applyPreset);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(1);
      expect(updateCurrentPageProperties).toHaveBeenCalledWith({
        properties: {
          backgroundColor: TEST_COLOR,
        },
      });
    });
  });
});
