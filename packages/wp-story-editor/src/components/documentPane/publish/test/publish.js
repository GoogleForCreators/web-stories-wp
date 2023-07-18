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
import { fireEvent, waitFor, screen } from '@testing-library/react';
import MockDate from 'mockdate';
import {
  APIContext,
  ConfigContext,
  StoryContext,
  SidebarContext,
} from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import PublishPanel from '../publish';

jest.mock('./../../../../api/publisherLogos', () => ({
  getPublisherLogos: jest.fn().mockResolvedValue([]),
  addPublisherLogo: jest.fn().mockResolvedValue([]),
}));

jest.mock('flagged');

function MediaUpload({ render }) {
  const open = jest.fn();
  return render(open);
}

function arrange(
  capabilities = {
    'assign-author': true,
    publish: true,
    hasUploadMediaAction: true,
  }
) {
  const updateStory = jest.fn();
  const storyContextValue = {
    state: {
      capabilities,
      meta: { isSaving: false },
      story: {
        author: { id: 1, name: 'John Doe' },
        date: '2020-01-01T20:20:20',
        modified: '2020-01-01T20:20:19',
        featuredMedia: { id: 0, url: '', height: 0, width: 0 },
        revisions: { count: 8, id: 189 },
        publisherLogo: { id: 0, url: '', height: 0, width: 0 },
        status: 'draft',
      },
    },
    actions: { updateStory },
  };

  const config = {
    capabilities,
    allowedMimeTypes: {
      image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    },
    revisionLink: 'http://example.com',
    apiCallbacks: {
      getAuthors: jest.fn().mockResolvedValue({}),
    },
    api: {
      publisherLogos: '/web-stories/v1/publisher-logos/',
    },
    MediaUpload,
  };
  const loadUsers = jest.fn();

  const sidebarContextValue = {
    actions: { loadUsers },
    state: {
      users: [{ value: 'foo' }, { value: 'bar' }],
    },
  };

  const actions = config.apiCallbacks;

  const view = renderWithTheme(
    <ConfigContext.Provider value={config}>
      <APIContext.Provider value={{ actions }}>
        <StoryContext.Provider value={storyContextValue}>
          <SidebarContext.Provider value={sidebarContextValue}>
            <PublishPanel />
          </SidebarContext.Provider>
        </StoryContext.Provider>
      </APIContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    ...view,
    updateStory,
  };
}

describe('PublishPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:publishing',
      JSON.stringify({ isCollapsed: false })
    );
    MockDate.set('2020-07-15T12:00:00+00:00');
    useFeature.mockImplementation(() => true);
  });

  afterAll(() => {
    localStorage.clear();
    MockDate.reset();
  });

  it('should render PublishPanel', async () => {
    arrange();
    const publishPanel = screen.getByText('Publishing');
    const publisherLogo = screen.getByText('Publisher Logo');
    const revisionsText = screen.getByText('8 Revisions');
    const revisionsLink = screen.getByRole('link', { name: 'Browse' });
    await waitFor(() => expect(publishPanel).toBeDefined());
    await waitFor(() => expect(publisherLogo).toBeDefined());
    await waitFor(() => expect(revisionsText).toBeDefined());
    expect(revisionsLink).toHaveAttribute(
      'href',
      'http://example.com/?revision=189'
    );
  });

  it('should display Author field if authors available', async () => {
    arrange();
    const element = screen.getByRole('button', { name: 'Author' });
    await waitFor(() => expect(element).toBeDefined());
  });

  it('should not display Author field without correct permissions', async () => {
    arrange({
      'assign-author': false,
    });
    const element = screen.queryByText('Author');
    await waitFor(() => expect(element).toBeNull());
  });

  it('should open Date picker when clicking on date', async () => {
    arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    await expect(
      screen.findByRole('button', { name: 'January 2020' })
    ).resolves.toBeInTheDocument();
  });

  it('should update the story when choosing a date from the calendar', async () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const firstOfJanuary = screen.getByRole('button', {
      name: 'January 1, 2020',
    });
    await waitFor(() => expect(firstOfJanuary).toBeDefined());

    fireEvent.click(firstOfJanuary);
    expect(updateStory).toHaveBeenCalledOnce();
    const calledArg = updateStory.mock.calls[0][0];
    const date = new Date(calledArg.properties.date);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
    expect(date.getFullYear()).toBe(2020);
  });

  it('should allow resetting the publish time', async () => {
    const { updateStory } = arrange();
    const dateButton = screen.getByRole('button', {
      name: 'Story publish time',
    });

    fireEvent.click(dateButton);
    const resetButton = screen.getByRole('button', {
      name: 'Reset publish time',
    });
    await waitFor(() => expect(resetButton).toBeDefined());
    fireEvent.click(resetButton);

    const calledArg = updateStory.mock.calls[0][0];
    expect(calledArg.properties.date).toBeNull();
  });

  it('should not update the date with incorrect hour', async () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const hours = screen.getByLabelText('Hours');

    // With PR#13339, Valid value for hour is from 1 to 12.
    // Value 30 is invalid for hour and will be discarded which resulted in 0 hour.
    // 0 is an invalid hour and won't fire onChange thus hour remains unchanged.
    fireEvent.change(hours, { target: { value: '30' } });
    fireEvent.blur(hours);

    await waitFor(() => {
      expect(updateStory).not.toHaveBeenCalled();
    });
  });

  it('should update the date with incorrect minutes by resetting to zero', async () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const minutes = screen.getByLabelText('Minutes');

    // With PR#13339, Valid value for minute is from 0 to 59.
    // Value 130 is invalid for minute and will be discarded which resulted in 0 minute.
    // 0 is a valid minute and will trigger fire onChange; thus updateStory will be called once.
    fireEvent.change(minutes, { target: { value: '130' } });
    fireEvent.blur(minutes);

    await waitFor(() => {
      expect(updateStory).toHaveBeenCalledOnce();
    });

    await waitFor(() => {
      const calledArg = updateStory.mock.calls[0][0];
      const updatedDate = new Date(calledArg.properties.date);
      expect(updatedDate.getMinutes()).toBe(0); // Should be updated to the zero.
    });
  });

  it('should open the calendar via keyboard events', async () => {
    arrange();

    let dateInCalendar = screen.queryByLabelText('January 1, 2020');
    expect(dateInCalendar).not.toBeInTheDocument();

    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.keyDown(element, {
      key: 'Enter',
      which: 13,
    });

    await waitFor(() => {
      dateInCalendar = screen.getByRole('button', { name: 'January 1, 2020' });
      expect(dateInCalendar).toBeDefined();
    });
  });
});
