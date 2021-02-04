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
import ColorPresetPanel from '../colorPreset';
import StoryContext from '../../../../../app/story/context';
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';
import {
  getShapePresets,
  getTextPresets,
  getPagePreset,
  presetHasOpacity,
  presetHasGradient,
  areAllType,
  getPanelInitialHeight,
} from '../utils';
import { renderWithTheme } from '../../../../../testUtils';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';
import createSolid from '../../../../../utils/createSolid';

jest.mock('../utils');

function setupPanel(extraStylePresets, extraStateProps, extraStoryPresets) {
  const updateStory = jest.fn();
  const updateElementsById = jest.fn();
  const updateCurrentPageProperties = jest.fn();
  const pushUpdate = jest.fn();

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
            type: 'shape',
          },
          textElement,
        ],
      },
      selectedElementIds: ['1'],
      selectedElements: [textElement],
      ...extraStateProps,
      story: {
        globalStoryStyles: {
          ...{ colors: [], textStyles: [] },
          ...extraStylePresets,
        },
        currentStoryStyles: {
          colors: [],
          ...extraStoryPresets,
        },
      },
    },
    actions: { updateStory, updateElementsById, updateCurrentPageProperties },
  };

  const {
    getAllByRole,
    getByRole,
    getByText,
    queryByLabelText,
    getByLabelText,
    queryByText,
    queryAllByLabelText,
  } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <ColorPresetPanel pushUpdate={pushUpdate} />
    </StoryContext.Provider>
  );
  return {
    getAllByRole,
    getByRole,
    getByText,
    queryByText,
    getByLabelText,
    pushUpdate,
    queryByLabelText,
    queryAllByLabelText,
    updateStory,
    updateElementsById,
    updateCurrentPageProperties,
  };
}

describe('Panels/Preset', () => {
  const EDIT_BUTTON_LABEL = 'Edit colors';
  const APPLY_GLOBAL_PRESET = 'Apply global color';
  const ADD_LOCAL_LABEL = 'Add local color';
  const ADD_GLOBAL_LABEL = 'Add global color';
  const PANEL_LABEL = 'Saved colors';
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
  const LINEAR_COLOR = {
    type: 'linear',
    stops: [
      {
        color: { r: 255, g: 0, b: 0 },
        position: 0,
      },
      {
        color: { r: 0, g: 0, b: 255 },
        position: 1,
      },
    ],
  };
  const BACKGROUND_PROPS = {
    backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
    backgroundColor: TEST_COLOR,
  };

  areAllType.mockImplementation((elType, els) => {
    return els.length > 0 && els.every(({ type }) => elType === type);
  });

  getPanelInitialHeight.mockReturnValue(150);

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:stylepreset-color',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <ColorPresetPanel /> panel', () => {
    const { getByText } = setupPanel();
    const element = getByText(PANEL_LABEL);
    expect(element).toBeInTheDocument();
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
    expect(queryByText(PANEL_LABEL)).not.toBeInTheDocument();
  });

  describe('Panels/Preset/Header', () => {
    it('should not display edit button if no presets exist', () => {
      const { queryByLabelText } = setupPanel();

      const editButton = queryByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).not.toBeInTheDocument();
    });

    it('should display buttons for adding local/global color if no presets exist', () => {
      const { queryByLabelText } = setupPanel();
      const addLocal = queryByLabelText(ADD_LOCAL_LABEL);
      expect(addLocal).toBeInTheDocument();

      const addGlobal = queryByLabelText(ADD_GLOBAL_LABEL);
      expect(addGlobal).toBeInTheDocument();
    });

    it('should have functional Edit button if relevant presets exist', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
      };
      const { getByLabelText, queryByLabelText } = setupPanel(
        extraStylePresets
      );
      const editButton = getByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);
      const exitEditModeButton = getByLabelText('Exit edit mode');
      expect(exitEditModeButton).toBeInTheDocument();
      expect(queryByLabelText(EDIT_BUTTON_LABEL)).not.toBeInTheDocument();

      fireEvent.click(exitEditModeButton);
      const newEditButton = getByLabelText(EDIT_BUTTON_LABEL);
      expect(newEditButton).toBeInTheDocument();
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
          textStyles: [],
        };
      });

      // Global color for the current story.
      const addButton = queryByLabelText(ADD_GLOBAL_LABEL);
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });

      updateStory.mockReset();

      // Local color for all stories.
      const addLocal = queryByLabelText(ADD_LOCAL_LABEL);
      fireEvent.click(addLocal);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          currentStoryStyles: {
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

      // Global color.
      const addButton = queryByLabelText(ADD_GLOBAL_LABEL);
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });

      updateStory.mockReset();
      // Color for current story.
      const addLocal = queryByLabelText(ADD_LOCAL_LABEL);
      fireEvent.click(addLocal);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          currentStoryStyles: {
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

      const addButton = queryByLabelText(ADD_GLOBAL_LABEL);
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });

      updateStory.mockReset();
      // Color for current story.
      const addLocal = queryByLabelText(ADD_LOCAL_LABEL);
      fireEvent.click(addLocal);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          currentStoryStyles: {
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

      const addButton = queryByLabelText(ADD_GLOBAL_LABEL);
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [TEST_COLOR_2],
            textStyles: [],
          },
        },
      });

      updateStory.mockReset();
      // Color for current story.
      const addLocal = queryByLabelText(ADD_LOCAL_LABEL);
      fireEvent.click(addLocal);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          currentStoryStyles: {
            colors: [TEST_COLOR_2],
          },
        },
      });
    });
  });

  describe('Panels/StylePreset/Colors', () => {
    it('should allow deleting the relevant color preset', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR, TEST_COLOR_2],
      };
      const extraStoryPresets = {
        colors: [TEST_COLOR, TEST_COLOR_2],
      };
      const { getByLabelText, queryAllByLabelText, updateStory } = setupPanel(
        extraStylePresets,
        null,
        extraStoryPresets
      );
      const editButton = getByLabelText(EDIT_BUTTON_LABEL);
      fireEvent.click(editButton);

      const deletePresets = queryAllByLabelText('Delete global color');
      expect(deletePresets[0]).toBeDefined();

      fireEvent.click(deletePresets[0]);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [TEST_COLOR_2],
            textStyles: [],
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
      const applyPreset = getByRole('button', { name: APPLY_GLOBAL_PRESET });
      expect(applyPreset).toBeInTheDocument();

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
      const { getByRole, pushUpdate } = setupPanel(extraStylePresets);
      const applyPreset = getByRole('button', { name: APPLY_GLOBAL_PRESET });
      expect(applyPreset).toBeInTheDocument();

      fireEvent.click(applyPreset);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
      expect(pushUpdate).toHaveBeenCalledWith(expect.any(Function), true);
      const updaterFunction = pushUpdate.mock.calls[0][0];
      const partiallyBlueContent = {
        content: 'Hello <span style="color: blue">World</span>',
      };
      const updatedContent = updaterFunction(partiallyBlueContent);
      const expectedContent = {
        content: '<span style="color: #010101">Hello World</span>',
      };
      expect(updatedContent).toStrictEqual(expectedContent);
    });

    it('should not apply colors with gradient to text', () => {
      const extraStylePresets = {
        colors: [LINEAR_COLOR],
      };

      presetHasGradient.mockImplementation(({ type }) => {
        return Boolean(type) && 'solid' !== type;
      });

      const { getByRole, pushUpdate } = setupPanel(extraStylePresets);
      const applyPreset = getByRole('button', { name: APPLY_GLOBAL_PRESET });
      expect(applyPreset).toBeInTheDocument();

      fireEvent.click(applyPreset);
      expect(pushUpdate).toHaveBeenCalledTimes(0);
    });

    it('should allow removing linear color when text selected', () => {
      const extraStylePresets = {
        colors: [LINEAR_COLOR],
      };
      const extraStoryPresets = {
        colors: [LINEAR_COLOR],
      };

      presetHasGradient.mockImplementation(({ type }) => {
        return Boolean(type) && 'solid' !== type;
      });

      const { getByLabelText, getByRole, updateStory } = setupPanel(
        extraStylePresets,
        null,
        extraStoryPresets
      );
      const editButton = getByLabelText(EDIT_BUTTON_LABEL);
      fireEvent.click(editButton);

      const deletePreset = getByRole('button', { name: 'Delete global color' });

      fireEvent.click(deletePreset);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [],
            textStyles: [],
          },
        },
      });

      updateStory.mockReset();
      const deleteStoryPreset = getByRole('button', {
        name: 'Delete local color',
      });
      fireEvent.click(deleteStoryPreset);
      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          currentStoryStyles: {
            colors: [],
          },
        },
      });
    });

    it('should not apply colors with opacity as Page background', () => {
      const extraStylePresets = {
        colors: [createSolid(1, 1, 1, 0.5), createSolid(1, 1, 1, 0)],
      };
      const extraStateProps = {
        selectedElements: [
          {
            id: 'bg',
          },
        ],
      };
      presetHasOpacity.mockImplementation((color) => {
        return Boolean(color.color?.a !== undefined && color.color.a < 1);
      });
      const { getAllByRole, updateCurrentPageProperties } = setupPanel(
        extraStylePresets,
        extraStateProps
      );

      const applyPresetButtons = getAllByRole('button', {
        name: APPLY_GLOBAL_PRESET,
      });
      const applyPreset1 = applyPresetButtons[0];
      expect(applyPreset1).toBeDefined();

      fireEvent.click(applyPreset1);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(0);

      const applyPreset2 = applyPresetButtons[1];
      expect(applyPreset2).toBeDefined();

      fireEvent.click(applyPreset2);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(0);
    });

    it('should allow applying color preset for Page background', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
      };
      const extraStoryPresets = {
        colors: [LINEAR_COLOR],
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
        extraStateProps,
        extraStoryPresets
      );

      // Global color.
      const applyPreset = getByRole('button', { name: APPLY_GLOBAL_PRESET });
      expect(applyPreset).toBeInTheDocument();

      fireEvent.click(applyPreset);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(1);
      expect(updateCurrentPageProperties).toHaveBeenCalledWith({
        properties: {
          backgroundColor: TEST_COLOR,
        },
      });

      // Local color.
      updateCurrentPageProperties.mockReset();
      const applyStoryPreset = getByRole('button', {
        name: 'Apply local color',
      });
      fireEvent.click(applyStoryPreset);
      expect(updateCurrentPageProperties).toHaveBeenCalledTimes(1);
      expect(updateCurrentPageProperties).toHaveBeenCalledWith({
        properties: {
          backgroundColor: LINEAR_COLOR,
        },
      });
    });
  });
});
