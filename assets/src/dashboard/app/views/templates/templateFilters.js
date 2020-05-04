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
import { useMemo, useState } from 'react';
/**
 * Internal dependencies
 */
import {
  TEMPLATE_CATEGORY_ITEMS,
  TEMPLATE_COLOR_ITEMS,
} from '../../../constants';

export function updateSelectedItems(items, setter) {
  return function (sender) {
    const newSelectedItems = items.map((item) => {
      if (item.value === sender) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    setter(newSelectedItems);
  };
}

export function clearAllSelectedItems(items, setter) {
  return function () {
    const newSelectedItems = items.map((item) => {
      return { ...item, selected: false };
    });

    setter(newSelectedItems);
  };
}

export default function useTemplateFilters() {
  const [selectedCategories, setSelectedCategories] = useState(
    TEMPLATE_CATEGORY_ITEMS
  );

  const [selectedColors, setSelectedColors] = useState(TEMPLATE_COLOR_ITEMS);

  return useMemo(
    () => ({
      selectedCategories,
      selectedColors,
      onNewCategorySelected: updateSelectedItems(
        selectedCategories,
        setSelectedCategories
      ),
      onNewColorSelected: updateSelectedItems(
        selectedColors,
        setSelectedColors
      ),
      clearAllCategories: clearAllSelectedItems(
        selectedCategories,
        setSelectedCategories
      ),
      clearAllColors: clearAllSelectedItems(selectedColors, setSelectedColors),
    }),
    [selectedColors, selectedCategories]
  );
}
