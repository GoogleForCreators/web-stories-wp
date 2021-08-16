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
import { act, renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useTemplateFilters from '../templateFilters';
import { TEMPLATE_CATEGORIES, TEMPLATE_COLORS } from '../../../../constants';

describe('templateFilters', () => {
  it('should select a color when the value is passed to the color selected method', () => {
    const { result } = renderHook(() => useTemplateFilters());

    act(() => {
      result.current.onNewColorSelected(TEMPLATE_COLORS.YELLOW);
    });

    const yellow = result.current.selectedColors.find(
      (color) => color.value === TEMPLATE_COLORS.YELLOW
    );

    expect(yellow.selected).toBe(true);
  });

  it('should select a category when the value is passed to the category selected method', () => {
    const { result } = renderHook(() => useTemplateFilters());

    act(() => {
      result.current.onNewCategorySelected(TEMPLATE_CATEGORIES.SPORTS);
    });

    const sports = result.current.selectedCategories.find(
      (category) => category.value === TEMPLATE_CATEGORIES.SPORTS
    );

    expect(sports.selected).toBe(true);
  });

  it('should clear the category selection when the clear method is called', () => {
    const { result } = renderHook(() => useTemplateFilters());

    act(() => {
      result.current.onNewCategorySelected(TEMPLATE_CATEGORIES.SPORTS);
    });

    expect(
      result.current.selectedCategories.find(
        (category) => category.value === TEMPLATE_CATEGORIES.SPORTS
      ).selected
    ).toBe(true);

    act(() => {
      result.current.clearAllCategories();
    });

    expect(
      result.current.selectedCategories.find(
        (category) => category.value === TEMPLATE_CATEGORIES.SPORTS
      ).selected
    ).toBe(false);
  });

  it('should clear the color selection when the clear method is called', () => {
    const { result } = renderHook(() => useTemplateFilters());

    act(() => {
      result.current.onNewColorSelected(TEMPLATE_COLORS.BLUE);
    });

    expect(
      result.current.selectedColors.find(
        (color) => color.value === TEMPLATE_COLORS.BLUE
      ).selected
    ).toBe(true);

    act(() => {
      result.current.clearAllColors();
    });

    expect(
      result.current.selectedColors.find(
        (color) => color.value === TEMPLATE_COLORS.BLUE
      ).selected
    ).toBe(false);
  });
});
