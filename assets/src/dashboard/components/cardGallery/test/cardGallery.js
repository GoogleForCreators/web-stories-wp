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
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
jest.mock('../../../../edit-story/components/previewPage/previewPage');
jest.mock('@web-stories-wp/design-system', () => {
  const { useEffect } = jest.requireActual('react');
  const useResizeEffect = (ref, cb) =>
    useEffect(() => {
      cb({ width: 100 });
    }, [cb]);
  return {
    __esModule: true,
    ...jest.requireActual('@web-stories-wp/design-system'),
    useResizeEffect,
  };
});
jest.mock('use-debounce', () => {
  const { useCallback } = jest.requireActual('react');
  const useDebouncedCallback = (cb) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(cb, []);
  };
  return {
    __esModule: true,
    useDebouncedCallback,
  };
});
import { PreviewPage } from '../../../../edit-story/components/previewPage';
import { renderWithProviders } from '../../../testUtils';
import CardGallery from '..';

const createMockTemplate = (pages) => ({
  id: 1,
  title: 'some-template',
  pages,
});

describe('CardGallery', () => {
  PreviewPage.mockImplementation(({ page }) => <div data-testid={page.name} />);

  it('should render CardGallery', async () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'test-child' },
      { id: 'id-2', name: 'test-child' },
      { id: 'id-3', name: 'test-child' },
      { id: 'id-4', name: 'test-child' },
    ]);
    act(() => {
      renderWithProviders(
        <CardGallery story={template} galleryLabel="Test Gallery" />
      );
    });
    // We don't render the page until we have measurements of the area we're rendering
    // this accounts for that behavior.
    await waitFor(() => {
      // totalCards = childrenCount + activeCardCount (there is only 1 active card at a time)
      const totalCards = 5;
      expect(screen.getAllByTestId('test-child')).toHaveLength(totalCards);
    });
  });

  it('should set first child as active child', async () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'active-child' },
      { id: 'id-2', name: 'non-active-child' },
      { id: 'id-3', name: 'non-active-child' },
      { id: 'id-4', name: 'non-active-child' },
    ]);

    act(() => {
      renderWithProviders(
        <CardGallery story={template} galleryLabel="Test Gallery" />
      );
    });

    await waitFor(() => {
      // The active child should always appear twice
      expect(screen.getAllByTestId('active-child')).toHaveLength(2);
    });
  });

  it('should change active child to the child that is clicked on', async () => {
    const template = createMockTemplate([
      { id: 'id-1', name: 'other-child' },
      { id: 'id-2', name: 'other-child' },
      { id: 'id-3', name: 'test-child' },
      { id: 'id-4', name: 'other-child' },
    ]);

    act(() => {
      renderWithProviders(
        <CardGallery story={template} galleryLabel="Test Gallery" />
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    // When the child is not active, it should only appear once
    const firstItem = screen.getByTestId('test-child');

    act(() => {
      // Simulate clicking on Item 3
      fireEvent.click(firstItem);
    });

    await waitFor(() => {
      // When active, it should appear twice
      expect(screen.getAllByTestId('test-child')).toHaveLength(2);
    });
  });
});
