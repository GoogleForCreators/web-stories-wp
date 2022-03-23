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
import { BACKGROUND_TEXT_MODE } from '@googleforcreators/design-system';
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StylePresetPanel from '../stylePresets';
import StoryContext from '../../../../../app/story/context';
import { getTextPresets, areAllType } from '../../../../../utils/presetUtils';

jest.mock('../../../../../utils/presetUtils');

function arrange(extraStylePresets, extraStateProps) {
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

const APPLY_PRESET = 'Apply style';
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

describe('panels/Text/Style', () => {
  beforeAll(() => {
    areAllType.mockImplementation((elType, els) => {
      return els.length > 0 && els.every(({ type }) => elType === type);
    });
  });

  afterAll(() => {
    localStorage.clear();
  });

  describe('panels/Text/Style/Header', () => {
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
      const { updateStory } = arrange(null, extraStateProps);

      getTextPresets.mockImplementation(() => {
        return {
          colors: [],
          textStyles: [TEST_STYLE],
        };
      });

      const addButton = screen.queryByLabelText('Add style');
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

  describe('panels/Text/Style/Styles', () => {
    it('should allow applying styles for text', () => {
      const extraStylePresets = {
        textStyles: [TEST_STYLE],
      };
      const { pushUpdate } = arrange(extraStylePresets);

      const applyPreset = screen.getByRole('button', { name: APPLY_PRESET });
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
