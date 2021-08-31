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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import { renderWithTheme } from '../../../../../testUtils';
import TaxonomiesPanel from '../taxonomies';

function arrange() {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        taxonomies: '',
      },
    },
    actions: { updateStory },
  };

  return renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <TaxonomiesPanel />
    </StoryContext.Provider>
  );
}

describe('TaxonomiesPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:taxonomies',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render Taxonomies Panel', () => {
    arrange();
    const element = screen.getByRole('button', { name: 'Categories and Tags' });
    expect(element).toBeInTheDocument();
  });
});
