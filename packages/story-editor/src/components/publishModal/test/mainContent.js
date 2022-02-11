/*
 * Copyright 2022 Google LLC
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
import { axe } from 'jest-axe';
/**
 * Internal dependencies
 */
import renderWithTheme from '../../../testUtils/renderWithTheme';
import InspectorContext from '../../inspector/context';
import { INPUT_KEYS } from '../constants';
import MainContent from '../mainContent';

describe('publishModal/mainContent', () => {
  const mockHandleUpdateStoryInfo = jest.fn();
  const mockHandleUpdateSlug = jest.fn();

  const mockInputValues = {
    [INPUT_KEYS.EXCERPT]:
      'A voyage to the great beyond, where none have gone and going back is impossible.',
    [INPUT_KEYS.TITLE]: "David Bowman's Odyssey",
    [INPUT_KEYS.SLUG]: '2001-space-odyssey',
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  const inspectorContextValue = {
    actions: { loadUsers: jest.fn() },
    state: {
      users: [{ value: 'foo' }, { value: 'bar' }],
    },
    data: {
      modalInspectorTab: {
        DocumentPane: null,
      },
    },
  };

  const view = () => {
    return renderWithTheme(
      <InspectorContext.Provider value={inspectorContextValue}>
        <MainContent
          handleUpdateStoryInfo={mockHandleUpdateStoryInfo}
          handleUpdateSlug={mockHandleUpdateSlug}
          inputValues={mockInputValues}
        />
      </InspectorContext.Provider>
    );
  };
  it('should have no accessibility issues', async () => {
    const { container } = view();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trigger handleUpdateStoryInfo on title input change', () => {
    view();

    const titleInput = screen.getByRole('textbox', { name: 'Story Title' });

    fireEvent.change(titleInput, {
      target: { value: "David Bowman (and HAL's) Odyseey" },
    });

    expect(mockHandleUpdateStoryInfo).toHaveBeenCalledTimes(1);

    fireEvent.blur(titleInput);

    expect(mockHandleUpdateSlug).toHaveBeenCalledTimes(1);
  });

  it('should trigger handleUpdateStoryInfo on excerpt input change', () => {
    view();

    const descriptionInput = screen.getByRole('textbox', {
      name: 'Story Description',
    });

    fireEvent.change(descriptionInput, {
      target: { value: 'Lorem ipsum' },
    });

    expect(mockHandleUpdateStoryInfo).toHaveBeenCalledTimes(1);
  });
});
