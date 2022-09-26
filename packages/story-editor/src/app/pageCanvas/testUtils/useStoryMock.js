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
import {
  createContext,
  identity,
  useContextSelector,
  useReduction,
} from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';

const Context = createContext(null);

const reducer = {
  setSelectedElement: ({ state }, { payload }) => ({
    state: {
      ...state,
      selectedElementIds: [payload.elementId],
    },
  }),
  updateSelectedElement: ({ state }, { payload }) => {
    const newCurrentPage = {
      ...state.currentPage,
      elements: state.currentPage.elements.reduce((els, el) => {
        if (state.selectedElementIds.includes(el.id)) {
          els.push({ ...el, ...payload.properties });
        } else {
          els.push(el);
        }
        return els;
      }, []),
    };
    return {
      state: {
        ...state,
        pages: [newCurrentPage],
        currentPage: newCurrentPage,
      },
    };
  },
  duplicateLastElement: ({ state }) => {
    const newCurrentPage = {
      ...state.currentPage,
      elements: [
        ...state.currentPage.elements,
        {
          ...state.currentPage.elements[state.currentPage.elements.length - 1],
          id: uuidv4(),
        },
      ],
    };
    return {
      state: {
        ...state,
        pages: [newCurrentPage],
        currentPage: newCurrentPage,
      },
    };
  },
};

export function MockStoryProvider({ children, mockContextValue }) {
  const [state, actions] = useReduction(mockContextValue, reducer);
  return (
    <Context.Provider
      value={{
        ...state,
        actions,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStoryMock(selector) {
  return useContextSelector(Context, selector ?? identity);
}
