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
import { fireEvent, render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import Buttons from '../buttons';
import theme from '../../../theme';

function setupButtons(extraStoryProps, extraMetaProps) {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      meta: { isSaving: false, ...extraMetaProps },
      story: { status: 'draft', storyId: 123, date: null, ...extraStoryProps },
    },
    actions: { updateStory },
  };
  const { getByText, container } = render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={storyContextValue}>
        <Buttons />
      </StoryContext.Provider>
    </ThemeProvider>
  );
  return {
    container,
    getByText,
    updateStory,
  };
}

describe('buttons', () => {
  const FUTURE_DATE = '9999-01-01T20:20:20';

  it('should display Publish button when in draft mode', () => {
    const { getByText } = setupButtons();
    const publishButton = getByText('Publish');
    expect(publishButton).toBeDefined();
  });

  it('should update window location when publishing', () => {
    const { getByText, updateStory } = setupButtons();
    const publishButton = getByText('Publish');

    fireEvent.click(publishButton);
    expect(updateStory).toHaveBeenCalledTimes(1);
    expect(window.location.href).toContain('post=123&action=edit');
  });

  it('should display Switch to draft button when published', () => {
    const { getByText, updateStory } = setupButtons({ status: 'publish' });
    const draftButton = getByText('Switch to Draft');

    expect(draftButton).toBeDefined();
    fireEvent.click(draftButton);
    expect(updateStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button when future date is set', () => {
    const { getByText, updateStory } = setupButtons({
      status: 'draft',
      date: FUTURE_DATE,
    });
    const scheduleButton = getByText('Schedule');

    expect(scheduleButton).toBeDefined();
    fireEvent.click(scheduleButton);
    expect(updateStory).toHaveBeenCalledTimes(1);
  });

  it('should display Schedule button with future status', () => {
    const { getByText } = setupButtons({
      status: 'future',
      date: FUTURE_DATE,
    });
    const scheduleButton = getByText('Schedule');

    expect(scheduleButton).toBeDefined();
  });

  it('should display Spinner while the story is updating', () => {
    const { container } = setupButtons({}, { isSaving: true });
    const spinner = container.querySelector('span');
    // @todo This test is relying on Gutenberg component's class list and should be replaced as soon as we have a custom spinner.
    expect(spinner.classList.contains('components-spinner')).toBe(true);
  });

  it('should open preview when clicking on Preview', () => {
    const { getByText } = setupButtons({ link: 'https://example.com' });
    const previewButton = getByText('Preview');

    expect(previewButton).toBeDefined();

    const mockedOpen = jest.fn();
    const originalWindow = { ...window };
    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      open: mockedOpen,
    }));

    fireEvent.click(previewButton);

    expect(mockedOpen).toHaveBeenCalledWith(
      'https://example.com/?preview=true',
      'story-preview'
    );

    windowSpy.mockRestore();
  });
});
