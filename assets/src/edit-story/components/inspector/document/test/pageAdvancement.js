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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import PageAdvancementPanel from '../pageAdvancement';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel(configs = {}) {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        autoAdvance: false,
        defaultPageDuration: 7,
        ...configs,
      },
    },
    actions: { updateStory },
  };
  const { getByRole } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <PageAdvancementPanel />
    </StoryContext.Provider>
  );
  return {
    getByRole,
    updateStory,
  };
}

describe('PageAdvancementPanel', () => {
  it('should render Page Advancement Panel', () => {
    const { getByRole, updateStory } = setupPanel();
    const element = getByRole('button', { name: 'Page Advancement' });
    expect(element).toBeDefined();
    fireEvent.click(getByRole('radio', { name: 'Auto' }));
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        autoAdvance: true,
      },
    });
  });

  it('should set Page Duration', async () => {
    const { getByRole, updateStory } = setupPanel({
      autoAdvance: true,
    });
    const element = getByRole('button', { name: 'Page Advancement' });
    expect(element).toBeDefined();

    const slider = getByRole('slider', { name: 'Default Page Duration' });

    fireEvent.change(slider, {
      target: { value: 0 },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          defaultPageDuration: 1,
        },
      })
    );

    updateStory.mockClear();
    fireEvent.change(slider, {
      target: { value: 1 },
    });

    await waitFor(() => {
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          defaultPageDuration: 1,
        },
      });
      expect(updateStory).toHaveBeenCalledTimes(1);
    });

    fireEvent.change(slider, {
      target: { value: 21 },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          defaultPageDuration: 20,
        },
      })
    );
  });
});
