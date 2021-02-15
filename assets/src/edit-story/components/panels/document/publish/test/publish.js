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
import ConfigContext from '../../../../../app/config/context';
import StoryContext from '../../../../../app/story/context';
import { renderWithTheme } from '../../../../../testUtils';
import InspectorContext from '../../../../inspector/context';
import PublishPanel from '../publish';

function setupPanel(
  capabilities = {
    hasAssignAuthorAction: true,
  }
) {
  const updateStory = jest.fn();
  const storyContextValue = {
    state: {
      meta: { isSaving: false },
      story: {
        author: { id: 1, name: 'John Doe' },
        date: '2020-01-01T20:20:20',
        featuredMedia: { url: '' },
        publisherLogoUrl: '',
      },
    },
    actions: { updateStory },
  };

  const config = { capabilities };
  const loadUsers = jest.fn();

  const inspectorContextValue = {
    actions: { loadUsers },
    state: {
      users: [{ value: 'foo' }, { value: 'bar' }],
    },
  };

  const {
    getByText,
    getByRole,
    queryByText,
    getByLabelText,
    queryByLabelText,
  } = renderWithTheme(
    <ConfigContext.Provider value={config}>
      <StoryContext.Provider value={storyContextValue}>
        <InspectorContext.Provider value={inspectorContextValue}>
          <PublishPanel />
        </InspectorContext.Provider>
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    getByText,
    getByRole,
    getByLabelText,
    queryByText,
    queryByLabelText,
    updateStory,
  };
}

describe('PublishPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:publishing',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render PublishPanel', async () => {
    const { getByText } = setupPanel();
    const publishPanel = getByText('Publishing');
    const publisherLogo = getByText('Publisher logo');

    await waitFor(() => expect(publishPanel).toBeDefined());
    await waitFor(() => expect(publisherLogo).toBeDefined());
  });

  it('should display Author field if authors available', async () => {
    const { getByRole } = setupPanel();
    const element = getByRole('button', { name: 'Author' });
    await waitFor(() => expect(element).toBeDefined());
  });

  it('should not display Author field without correct permissions', async () => {
    const { queryByText } = setupPanel({
      hasAssignAuthorAction: false,
    });
    const element = queryByText('Author');
    await waitFor(() => expect(element).toBeNull());
  });

  it('should open Date picker when clicking on date', async () => {
    const { getByRole } = setupPanel();
    const element = getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const calendar = getByRole('button', { name: 'January 2020' });
    await waitFor(() => expect(calendar).toBeDefined());
  });

  it('should update the story when choosing a date from the calendar', async () => {
    const { getByRole, updateStory } = setupPanel();
    const element = getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const firstOfJanuary = getByRole('button', { name: 'January 1, 2020' });
    await waitFor(() => expect(firstOfJanuary).toBeDefined());

    fireEvent.click(firstOfJanuary);
    expect(updateStory).toHaveBeenCalledTimes(1);
    const calledArg = updateStory.mock.calls[0][0];
    const date = new Date(calledArg.properties.date);
    expect(date.getMonth()).toStrictEqual(0);
    expect(date.getDate()).toStrictEqual(1);
    expect(date.getFullYear()).toStrictEqual(2020);
  });

  it('should update the story when choosing time', async () => {
    const { getByRole, getByLabelText, updateStory } = setupPanel();
    const element = getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const hours = getByLabelText('Hours');
    const minutes = getByLabelText('Minutes');
    const am = getByRole('button', { name: 'AM' });

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
    expect(date1.getHours()).toStrictEqual(21);

    const date2 = new Date(calledArgs[1][0].properties.date);
    expect(date2.getMinutes()).toStrictEqual(59);

    // After choosing AM, the hours should be 9.
    const date3 = new Date(calledArgs[2][0].properties.date);
    expect(date3.getHours()).toStrictEqual(9);
  });

  it('should not update the date with incorrect times', async () => {
    const { getByRole, getByLabelText, updateStory } = setupPanel();
    const element = getByRole('button', { name: 'Story publish time' });

    fireEvent.click(element);
    const hours = getByLabelText('Hours');
    const minutes = getByLabelText('Minutes');

    fireEvent.change(hours, { target: { value: '30' } });
    fireEvent.blur(hours);

    fireEvent.change(minutes, { target: { value: '130' } });
    fireEvent.blur(minutes);

    await waitFor(() => expect(updateStory).toHaveBeenCalledTimes(0));
  });

  it('should open the calendar via keyboard events', async () => {
    const { getByRole, queryByLabelText } = setupPanel();

    let dateInCalendar = queryByLabelText('January 1, 2020');
    expect(dateInCalendar).not.toBeInTheDocument();

    const element = getByRole('button', { name: 'Story publish time' });
    fireEvent.keyDown(element, {
      key: 'Enter',
      which: 13,
    });

    dateInCalendar = getByRole('button', { name: 'January 1, 2020' });
    await waitFor(() => expect(dateInCalendar).toBeDefined());
  });
});
