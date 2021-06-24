/*
 * Copyright 2021 Google LLC
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
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

export const CountContext = createContext(null);
export const CategoryContext = createContext(null);

const CHECK_CATEGORY = {
  priority: 'priority',
  design: 'design',
  accessibility: 'accessibility',
};

const INITIAL_STATE = {
  [CHECK_CATEGORY.priority]: {},
  [CHECK_CATEGORY.design]: {},
  [CHECK_CATEGORY.accessibility]: {},
};
function ChecklistCountProvider({ children }) {
  const value = useState(INITIAL_STATE);
  return (
    <CountContext.Provider value={value}>{children}</CountContext.Provider>
  );
}
ChecklistCountProvider.propTypes = {
  children: PropTypes.node,
};

function ChecklistCategoryProvider({ children, category }) {
  const setCategories = useContext(CountContext)?.[1];
  if (!setCategories) {
    throw new Error(
      'Cannot use `ChecklistCategoryProvider` outside of `ChecklistCountProvider`'
    );
  }

  const addEntry = useCallback(
    (entry) =>
      setCategories((categories) => ({
        ...categories,
        [category]: {
          ...categories[category],
          ...entry,
        },
      })),
    [category, setCategories]
  );

  return (
    <CategoryContext.Provider value={addEntry}>
      {children}
    </CategoryContext.Provider>
  );
}
ChecklistCategoryProvider.propTypes = {
  children: PropTypes.node,
  category: PropTypes.oneOf(Object.values(CHECK_CATEGORY)).isRequired,
};

function useRegisterCheck(id, isRendered) {
  const addEntry = useContext(CategoryContext);
  if (!addEntry) {
    throw new Error(
      'Cannot use `useRegisterCheck` outside of `ChecklistCategoryProvider`'
    );
  }
  useEffect(() => addEntry({ [id]: isRendered }), [id, addEntry, isRendered]);
}

function useIsChecklistEmpty() {
  const categories = useContext(CountContext)?.[0];
  if (!categories) {
    throw new Error(
      'Cannot use `useIsChecklistEmpty` outside of `ChecklistCountProvider`'
    );
  }
  return (
    Object.values(categories)
      .map((category) => Object.values(category))
      .flatMap((v) => v)
      .filter((isRendered) => isRendered).length > 0
  );
}

function useCategoryCount(category) {
  const categories = useContext(CountContext)?.[0];
  if (!categories) {
    throw new Error(
      'Cannot use `useCategoryCount` outside of `ChecklistCountProvider`'
    );
  }
  return Object.values(categories[category] || {}).filter(
    (isRendered) => isRendered
  ).length;
}

export {
  ChecklistCountProvider,
  ChecklistCategoryProvider,
  useRegisterCheck,
  useIsChecklistEmpty,
  useCategoryCount,
  CHECK_CATEGORY,
};
