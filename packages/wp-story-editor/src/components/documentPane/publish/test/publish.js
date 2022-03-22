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

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
import PublishPanel from '../publish';

jest.mock('./../../../../api/publisherLogos', () => ({
  getPublisherLogos: jest.fn().mockResolvedValue([]),
  addPublisherLogo: jest.fn().mockResolvedValue([]),
}));

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
  });

  afterAll(() => {
    localStorage.clear();
    MockDate.reset();
  });

  it('should render PublishPanel', async () => {
    arrange();
    const publishPanel = screen.getByText('Publishing');
    const publisherLogo = screen.getByText('Publisher Logo');

    await waitFor(() => expect(publishPanel).toBeDefined());
    await waitFor(() => expect(publisherLogo).toBeDefined());
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
    expect(updateStory).toHaveBeenCalledTimes(1);
    const calledArg = updateStory.mock.calls[0][0];
    const date = new Date(calledArg.properties.date);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
    expect(date.getFullYear()).toBe(2020);
  });

  it('should allow resetting the publish time', async () => {
    const { updateStory } = arrange();
    let dateButton = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(dateButton);
    const resetButton = screen.getByRole('button', {
      name: 'Reset publish time',
    });
    await waitFor(() => expect(resetButton).toBeDefined());
    fireEvent.click(resetButton);

    const calledArg = updateStory.mock.calls[0][0];
    expect(calledArg.properties.date).toBeNull();

    dateButton = screen.getByRole('button', { name: 'Story publish time' });
  });

  it('should update the story when choosing time', async () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const hours = screen.getByLabelText('Hours');
    const minutes = screen.getByLabelText('Minutes');
    const am = screen.getByRole('button', { name: 'AM' });

    await waitFor(() => expect(minutes).toBeDefined());
    expect(hours).toBeInTheDocument();
    expect(am).toBeInTheDocument();

    fireEvent.change(hours, { target: { value: '9' } });
    fireEvent.blur(hours);

    fireEvent.change(minutes, { target: { value: '59' } });
    fireEvent.blur(minutes);

    fireEvent.click(am);

    expect(updateStory).toHaveBeenCalledTimes(3);
    const calledArgs = updateStory.mock.calls;

    // The original date was using PM.
    const date1 = new Date(calledArgs[0][0].properties.date);
    expect(date1.getHours()).toBe(21);

    const date2 = new Date(calledArgs[1][0].properties.date);
    expect(date2.getMinutes()).toBe(59);

    // After choosing AM, the hours should be 9.
    const date3 = new Date(calledArgs[2][0].properties.date);
    expect(date3.getHours()).toBe(9);
  });

  it('should not update the date with incorrect times', async () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const hours = screen.getByLabelText('Hours');
    const minutes = screen.getByLabelText('Minutes');

    fireEvent.change(hours, { target: { value: '30' } });
    fireEvent.blur(hours);

    fireEvent.change(minutes, { target: { value: '130' } });
    fireEvent.blur(minutes);

    await waitFor(() => expect(updateStory).toHaveBeenCalledTimes(0));
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
