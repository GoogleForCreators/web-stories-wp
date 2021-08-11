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
import CardTitle from '../cardTitle';
import { renderWithProviders } from '../../../testUtils';
import { STORY_STATUS } from '../../../constants';

describe('CardTitle', () => {
  it('should render Card Title with static text when edit mode is false', () => {
    renderWithProviders(
      <CardTitle
        id={123}
        title="Sample Story"
        displayDate="01/20/2020"
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        editMode={false}
        tabIndex={0}
      />
    );

    expect(screen.queryByTestId('inline-input-form')).not.toBeInTheDocument();
    expect(screen.getByText('Sample Story')).toBeInTheDocument();
  });

  it('should render Card Title with an input field when edit mode is true', () => {
    renderWithProviders(
      <CardTitle
        title="Sample Story"
        displayDate="01/20/2020"
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        editMode
        id="sampleStoryId"
        tabIndex={0}
      />
    );
    const titleInput = screen.getByDisplayValue('Sample Story');
    const inputLabel = screen.getByLabelText('Rename story');

    expect(inputLabel).toBeInTheDocument();
    expect(titleInput).toBeInTheDocument();
  });

  it(`should prepend "Draft" before displayDate when status is ${STORY_STATUS.DRAFT}`, () => {
    renderWithProviders(
      <CardTitle
        id={123}
        title="Sample Story"
        displayDate="04/23/2020"
        status={STORY_STATUS.DRAFT}
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        editMode={false}
        tabIndex={0}
      />
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it(`should display "Scheduled" before created date when ${STORY_STATUS.FUTURE}`, () => {
    renderWithProviders(
      <CardTitle
        id={123}
        title="Sample Story"
        displayDate="04/23/2020"
        status={STORY_STATUS.FUTURE}
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        editMode={false}
        tabIndex={0}
      />
    );

    expect(screen.getByText(/^Scheduled/)).toBeInTheDocument();
  });

  it(`should display "Published" before created date when ${STORY_STATUS.PUBLISH}`, () => {
    renderWithProviders(
      <CardTitle
        id={123}
        title="Sample Story"
        displayDate="04/23/2020"
        status={STORY_STATUS.PUBLISH}
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        editMode={false}
        tabIndex={0}
      />
    );

    expect(screen.getByText(/^Published/)).toBeInTheDocument();
  });

  it('should render Card Title with an author', () => {
    renderWithProviders(
      <CardTitle
        id={123}
        title="Sample Story"
        secondaryTitle="Harry Potter"
        displayDate="01/20/2020"
        onEditCancel={jest.fn}
        onEditComplete={jest.fn}
        tabIndex={0}
      />
    );

    expect(screen.getByText('Harry Potter')).toBeInTheDocument();
  });
});
