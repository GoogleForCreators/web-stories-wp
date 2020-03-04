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
import StoryContext from '../../../app/story/context';
import createSolid from '../../../utils/createSolid';
import theme from '../../../theme';
import PageBackgroundPanel from '../pageBackground.js';

function setupPanel(backgroundColor = null) {
  const currentPage = { backgroundColor };
  const updateCurrentPageProperties = jest.fn();
  const contextValue = {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  };
  const { getByLabelText } = render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={contextValue}>
        <PageBackgroundPanel />
      </StoryContext.Provider>
    </ThemeProvider>
  );
  const element = getByLabelText('Current page color');
  return {
    element,
    updateCurrentPageProperties,
  };
}

describe('PageBackgroundPanel', () => {
  it('should display a color picker with default color if none set', () => {
    const { element } = setupPanel();
    expect(element.innerHTML).toStrictEqual('FFFFFF');
  });

  it('should display a color picker with current color', () => {
    const { element } = setupPanel(createSolid(255, 0, 0));
    expect(element.innerHTML).toStrictEqual('FF0000');
  });
});
