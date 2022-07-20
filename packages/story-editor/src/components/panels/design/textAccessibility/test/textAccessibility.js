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
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */

import StoryContext from '../../../../../app/story/context';
import { renderPanel } from '../../../shared/test/_utils';
import TextAccessibilityPanel from '../textAccessibility';

jest.mock('flagged');

describe('Panels/TextAccessibility', () => {
  const defaultElement = {
    type: 'text',
    tagName: 'p',
    content: 'Hello!',
  };

  const storyContextValue = {
    state: {
      currentPage: { elements: [] },
    },
  };

  const wrapper = ({ children }) => (
    <StoryContext.Provider value={storyContextValue}>
      {children}
    </StoryContext.Provider>
  );

  function arrange(selectedElements) {
    return renderPanel(TextAccessibilityPanel, selectedElements, wrapper);
  }

  beforeAll(() => {
    useFeature.mockImplementation(() => true);
    localStorage.setItem(
      'web_stories_ui_panel_settings:textAccessibility',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <TextAccessibilityPanel /> when experiment is enabled', () => {
    arrange([
      defaultElement,
      {
        type: 'text',
        tagName: 'h2',
        content: 'Hello friends!',
      },
      {
        type: 'text',
        tagName: 'h1',
        content: 'Zorak here!',
      },
    ]);
    const input = screen.getByTestId('text-accessibility-dropdown');
    expect(input).toBeInTheDocument();
  });

  it('should call pushUpdate when dropdown has been updated', () => {
    const { pushUpdate } = arrange([defaultElement]);
    const input = screen.getByTestId('text-accessibility-dropdown');
    fireEvent.click(input);
    const option2 = screen.queryAllByRole('option')[1];
    fireEvent.click(option2);
    expect(pushUpdate).toHaveBeenCalledTimes(1);
  });

  it('should call pushUpdate three times when multiple items have been updated', () => {
    const { pushUpdate } = arrange([
      defaultElement,
      {
        type: 'text',
        tagName: 'h2',
        content: 'Hello friends!',
      },
      {
        type: 'text',
        tagName: 'h1',
        content: 'Zorak here!',
      },
    ]);
    const input = screen.getByTestId('text-accessibility-dropdown');
    fireEvent.click(input);
    const option2 = screen.queryAllByRole('option')[1];
    fireEvent.click(option2);
    expect(pushUpdate).toHaveBeenCalledTimes(3);
  });
});
