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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import InspectorContext from '../../../inspector/context';
import theme from '../../../../theme';
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
        author: 'test',
        date: '2020-01-01T20:20:20',
        featuredMediaUrl: '',
        publisherLogoUrl: '',
      },
      capabilities,
    },
    actions: { updateStory },
  };
  const inspectorContextValue = {
    state: {
      users: [{ value: 'foo' }, { value: 'bar' }],
    },
  };
  const { getByText, getByRole, queryByText } = render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={storyContextValue}>
        <InspectorContext.Provider value={inspectorContextValue}>
          <PublishPanel />
        </InspectorContext.Provider>
      </StoryContext.Provider>
    </ThemeProvider>
  );
  return {
    getByText,
    getByRole,
    queryByText,
  };
}

describe('PublishPanel', () => {
  it('should render PublishPanel', () => {
    const { getByText } = setupPanel();
    const publishPanel = getByText('Publishing');
    const publisherLogo = getByText('Publisher Logo');

    expect(publishPanel).toBeDefined();
    expect(publisherLogo).toBeDefined();
  });

  it('should display Author field if authors available', () => {
    const { getByText } = setupPanel();
    const element = getByText('Author');
    expect(element).toBeDefined();
  });

  it('should not display Author field without correct permissions', () => {
    const { queryByText } = setupPanel({
      hasAssignAuthorAction: false,
    });
    const element = queryByText('Author');
    expect(element).toBeNull();
  });

  it('should open Date picker when clicking on date', () => {
    const { getByText, getByRole } = setupPanel();
    const element = getByText('01/01/2020');

    fireEvent.click(element);
    const calendar = getByRole('application');
    expect(calendar).toBeDefined();
  });
});
