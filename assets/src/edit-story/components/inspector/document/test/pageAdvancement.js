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
import StoryContext from '../../../../app/story/context';
import PageAdvancementPanel from '../pageAdvancement';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel() {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        autoAdvance: false,
        defaultPageDuration: 7,
      },
    },
    actions: { updateStory },
  };
  const { getByText } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <PageAdvancementPanel />
    </StoryContext.Provider>
  );
  return {
    getByText,
    updateStory,
  };
}

describe('PageAdvancementPanel', () => {
  it('should render Page Advancement Panel', () => {
    const { getByText, updateStory } = setupPanel();
    const element = getByText('Page Advancement');
    expect(element).toBeDefined();
    fireEvent.click(getByText('Auto'));
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        autoAdvance: true,
      },
    });
  });
});
