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
import Media3pCategories from '../media3pCategories';
import { renderWithTheme } from '../../../../../../testUtils';

describe('Media3pCategories', () => {
  const categories = [
    {
      id: '1',
      displayName: 'Category 1',
    },
    {
      id: '2',
      displayName: 'Category 2',
    },
    {
      id: '3',
      displayName: 'Category 3',
    },
  ];
  const selectCategoryMock = jest.fn();
  const deselectCategoryMock = jest.fn();

  it('should render <Media3pCategories /> without categories', () => {
    const { getByRole } = renderWithTheme(
      <Media3pCategories
        categories={[]}
        selectedCategoryId={undefined}
        selectCategory={selectCategoryMock}
        deselectCategory={deselectCategoryMock}
      />
    );

    expect(getByRole('tablist')).toBeDefined();
  });

  it('should render <Media3pCategories /> with categories', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Media3pCategories
        categories={categories}
        selectedCategoryId={undefined}
        selectCategory={selectCategoryMock}
        deselectCategory={deselectCategoryMock}
      />
    );

    const categoryContainer = getByRole('tablist');
    const categoryPill1 = getByText('Category 1');
    const categoryPill2 = getByText('Category 2');
    const categoryPill3 = getByText('Category 3');

    expect(categoryContainer).toBeDefined();
    expect(categoryPill1).toHaveAttribute('aria-selected', 'false');
    expect(categoryPill2).toHaveAttribute('aria-selected', 'false');
    expect(categoryPill3).toHaveAttribute('aria-selected', 'false');
  });

  it('should render <Media3pCategories /> with a selected category', () => {
    const { getByRole } = renderWithTheme(
      <Media3pCategories
        categories={categories}
        selectedCategoryId={'1'}
        selectCategory={selectCategoryMock}
        deselectCategory={deselectCategoryMock}
      />
    );

    const categoryPill1 = getByRole('tab', { name: 'Category 1' });

    expect(categoryPill1).toHaveAttribute('aria-selected', 'true');
  });

  it('should render <Media3pCategories /> with and allow selection', () => {
    const { getByRole } = renderWithTheme(
      <Media3pCategories
        categories={categories}
        selectedCategoryId={undefined}
        selectCategory={selectCategoryMock}
        deselectCategory={deselectCategoryMock}
      />
    );
    const categoryPill1 = getByRole('tab', { name: 'Category 1' });

    fireEvent.click(categoryPill1);

    expect(selectCategoryMock).toHaveBeenCalledWith('1');
  });

  it('should render <Media3pCategories /> with and allow deselection', () => {
    const { getByRole } = renderWithTheme(
      <Media3pCategories
        categories={categories}
        selectedCategoryId={'1'}
        selectCategory={selectCategoryMock}
        deselectCategory={deselectCategoryMock}
      />
    );
    const categoryPill1 = getByRole('tab', { name: 'Category 1' });

    fireEvent.click(categoryPill1);

    expect(deselectCategoryMock).toHaveBeenCalledWith();
  });
});
