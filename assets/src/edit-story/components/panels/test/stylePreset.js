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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import StylePresetPanel from '../stylePreset';
import StoryContext from '../../../app/story/context';

function setupPanel(extraStateProps) {
  const updateStory = jest.fn();
  const updateElementsById = jest.fn();

  const textElement = {
    id: '1',
    type: 'text',
    x: 111,
    y: 112,
    width: 211,
    height: 221,
    rotationAngle: 1,
  };
  const storyContextValue = {
    state: {
      selectedElementIds: ['1'],
      selectedElements: [textElement],
      story: {
        stylePresets: { colors: [], textColors: [] },
      },
      ...extraStateProps,
    },
    actions: { updateStory, updateElementsById },
  };
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={storyContextValue}>
        <StylePresetPanel />
      </StoryContext.Provider>
    </ThemeProvider>
  );
  return {
    getByText,
    updateStory,
    updateElementsById,
  };
}

describe('Panels/StylePreset', () => {
  it('should render <StylePresetPanel /> panel', () => {
    const { getByText } = setupPanel();
    const element = getByText('Style presets');
    expect(element).toBeDefined();
  });
});
