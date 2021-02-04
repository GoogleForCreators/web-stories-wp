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
jest.mock('../../../../edit-story/components/previewPage/previewPage');
import { PreviewPage } from '../../../../edit-story/components/previewPage';
import { renderWithProviders } from '../../../testUtils/';
import CardGallery from '../';

const createMockTemplate = (pages) => ({
  id: 1,
  title: 'some-template',
  pages,
});

describe('CardGallery', () => {
  PreviewPage.mockImplementation(({ page }) => <div data-testid={page.name} />);

  it('should render CardGallery', () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'test-child' },
      { id: 'id-2', name: 'test-child' },
      { id: 'id-3', name: 'test-child' },
      { id: 'id-4', name: 'test-child' },
    ]);

    const { getAllByTestId } = renderWithProviders(
      <CardGallery story={template} galleryLabel="Test Gallery" />
    );

    // totalCards = childrenCount + activeCardCount (there is only 1 active card at a time)
    const totalCards = 5;
    expect(getAllByTestId('test-child')).toHaveLength(totalCards);
  });

  it('should set first child as active child', () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'active-child' },
      { id: 'id-2', name: 'non-active-child' },
      { id: 'id-3', name: 'non-active-child' },
      { id: 'id-4', name: 'non-active-child' },
    ]);

    const { getAllByTestId } = renderWithProviders(
      <CardGallery story={template} galleryLabel="Test Gallery" />
    );

    // The active child should always appear twice
    expect(getAllByTestId('active-child')).toHaveLength(2);
  });

  it('should change active child to the child that is clicked on', () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'other-child' },
      { id: 'id-2', name: 'other-child' },
      { id: 'id-3', name: 'test-child' },
      { id: 'id-4', name: 'other-child' },
    ]);

    const { getAllByTestId, getByTestId } = renderWithProviders(
      <CardGallery story={template} galleryLabel="Test Gallery" />
    );

    // When the child is not active, it should only appear once
    const firstItem = getByTestId('test-child');

    // Simulate clicking on Item 3
    fireEvent.click(firstItem);

    // When active, it should appear twice
    expect(getAllByTestId('test-child')).toHaveLength(2);
  });
});
