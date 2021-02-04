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
import StylePresetPanel from '../stylePreset';
import StoryContext from '../../../../../app/story/context';
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';
import { getTextPresets, areAllType, getPanelInitialHeight } from '../utils';
import { renderWithTheme } from '../../../../../testUtils';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';

jest.mock('../utils');

function setupPanel(extraStylePresets, extraStateProps) {
  const updateStory = jest.fn();
  const updateElementsById = jest.fn();
  const pushUpdate = jest.fn();

  const textElement = {
    id: '1',
    type: 'text',
    content: 'Hello, styles',
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
        },
      },
    },
    actions: { updateStory, updateElementsById },
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
      <StylePresetPanel pushUpdate={pushUpdate} />
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
  };
}

describe('Panels/Preset', () => {
  const EDIT_BUTTON_LABEL = 'Edit styles';
  const APPLY_PRESET = 'Apply style';
  const PANEL_LABEL = 'Saved styles';
  const TEST_COLOR = {
    color: {
      r: 1,
      g: 1,
      b: 1,
    },
  };
  const BACKGROUND_PROPS = {
    backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
    backgroundColor: TEST_COLOR,
  };

  const TEST_STYLE = {
    color: TEST_COLOR,
    letterSpacing: 1,
    lineHeight: 2,
    ...BACKGROUND_PROPS,
    fontWeight: 700,
    font: TEXT_ELEMENT_DEFAULT_FONT,
  };

  areAllType.mockImplementation((elType, els) => {
    return els.length > 0 && els.every(({ type }) => elType === type);
  });

  getPanelInitialHeight.mockReturnValue(150);

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:stylepreset-style',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <StylePresetPanel /> panel', () => {
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
    it('should display only Add button if no presets exist', () => {
      const { queryByLabelText } = setupPanel();
      const addButton = queryByLabelText('Add style');
      expect(addButton).toBeInTheDocument();

      const editButton = queryByLabelText(EDIT_BUTTON_LABEL);
      expect(editButton).not.toBeInTheDocument();
    });

    it('should add a text style preset', () => {
      const extraStateProps = {
        selectedElements: [
          {
            id: '1',
            type: 'text',
            content:
              '<span style="letter-spacing: 2px; color: rgb(1, 1, 1)">Content</span>',
            backgroundTextMode: BACKGROUND_TEXT_MODE.FILL,
            backgroundColor: TEST_COLOR,
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
          colors: [],
          textStyles: [TEST_STYLE],
        };
      });

      const addButton = queryByLabelText('Add style');
      fireEvent.click(addButton);

      expect(updateStory).toHaveBeenCalledTimes(1);
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          globalStoryStyles: {
            colors: [],
            textStyles: [TEST_STYLE],
          },
        },
      });
    });
  });

  describe('Panels/StylePreset/Styles', () => {
    it('should allow applying styles for text', () => {
      const extraStylePresets = {
        textStyles: [TEST_STYLE],
      };
      const { getByRole, pushUpdate } = setupPanel(extraStylePresets);

      const applyPreset = getByRole('button', { name: APPLY_PRESET });
      expect(applyPreset).toBeInTheDocument();

      fireEvent.click(applyPreset);
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
  });
});
