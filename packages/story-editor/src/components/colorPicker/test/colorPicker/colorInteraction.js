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
import { fireEvent, screen } from '@testing-library/react';
import {
  setAppElement,
  BACKGROUND_TEXT_MODE,
} from '@googleforcreators/design-system';
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import ColorPicker from '../../colorPicker';
import { StoryContext } from '../../../../app/story';
import {
  getShapePresets,
  getTextPresets,
  getPagePreset,
  areAllType,
} from '../../../../utils/presetUtils';

jest.mock('../../../../utils/presetUtils');

function arrange(extraStylePresets, extraStateProps, extraStoryPresets) {
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
    container,
  } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <ColorPicker allowsSavedColors onChange={() => jest.fn()} />
    </StoryContext.Provider>
  );
  setAppElement(container);
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

const EDIT_BUTTON_LABEL = 'Edit colors';
const ADD_LOCAL_LABEL = 'Add local color';
const ADD_GLOBAL_LABEL = 'Add global color';
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

describe('colorPicker/colorsInteraction', () => {
  beforeAll(() => {
    areAllType.mockImplementation((elType, els) => {
      return els.length > 0 && els.every(({ type }) => elType === type);
    });
  });

  afterAll(() => {
    localStorage.clear();
  });

  describe('colorPicker/Header', () => {
    it('should not display edit button if no presets exist', () => {
      arrange();

      const editButton = screen.queryByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).not.toBeInTheDocument();
    });

    it('should display buttons for adding local/global color if no presets exist', () => {
      arrange();
      const addLocal = screen.queryByLabelText(ADD_LOCAL_LABEL);
      expect(addLocal).toBeInTheDocument();

      const addGlobal = screen.queryByLabelText(ADD_GLOBAL_LABEL);
      expect(addGlobal).toBeInTheDocument();
    });

    it('should have functional Edit button if relevant presets exist', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR],
      };
      arrange(extraStylePresets);
      const editButton = screen.getByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);
      const exitEditModeButton = screen.getByLabelText('Exit edit mode');
      expect(exitEditModeButton).toBeInTheDocument();
      expect(
        screen.queryByLabelText(EDIT_BUTTON_LABEL)
      ).not.toBeInTheDocument();

      fireEvent.click(exitEditModeButton);
      const newEditButton = screen.getByLabelText(EDIT_BUTTON_LABEL);
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
      const { updateStory } = arrange(null, extraStateProps);

      getTextPresets.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
          textStyles: [],
        };
      });

      // Global color for the current story.
      const addButton = screen.queryByLabelText(ADD_GLOBAL_LABEL);
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
      const addLocal = screen.queryByLabelText(ADD_LOCAL_LABEL);
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
      const { updateStory } = arrange(null, extraStateProps);

      getTextPresets.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
        };
      });

      // Global color.
      const addButton = screen.queryByLabelText(ADD_GLOBAL_LABEL);
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
      const addLocal = screen.queryByLabelText(ADD_LOCAL_LABEL);
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
      const { updateStory } = arrange(null, extraStateProps);

      getShapePresets.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = screen.queryByLabelText(ADD_GLOBAL_LABEL);
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
      const addLocal = screen.queryByLabelText(ADD_LOCAL_LABEL);
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
      const { updateStory } = arrange(null, extraStateProps);

      getPagePreset.mockImplementation(() => {
        return {
          colors: [TEST_COLOR_2],
        };
      });

      const addButton = screen.queryByLabelText(ADD_GLOBAL_LABEL);
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
      const addLocal = screen.queryByLabelText(ADD_LOCAL_LABEL);
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

  describe('colorPicker/colorInteraction', () => {
    it('should allow deleting the relevant color preset', () => {
      const extraStylePresets = {
        colors: [TEST_COLOR, TEST_COLOR_2],
      };
      const extraStoryPresets = {
        colors: [TEST_COLOR, TEST_COLOR_2],
      };
      const { updateStory } = arrange(
        extraStylePresets,
        null,
        extraStoryPresets
      );
      const editButton = screen.getByLabelText(EDIT_BUTTON_LABEL);
      fireEvent.click(editButton);

      const deletePresets = screen.queryAllByTitle(/Delete global color/);

      expect(deletePresets[0]).toBeDefined();

      fireEvent.click(deletePresets[0]);
      const confirmationButton = screen.getByRole('button', { name: 'Delete' });
      fireEvent.click(confirmationButton);

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
  });
});
