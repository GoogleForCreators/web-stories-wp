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
import { useContext } from '@googleforcreators/react';
import { act, renderHook, render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { ISSUE_TYPES } from '../../constants';
import {
  ChecklistCountProvider,
  ChecklistCategoryProvider,
  CategoryContext,
  CountContext,
  useRegisterCheck,
} from '../checkCountContext';

let consoleErrorFn;

describe('ChecklistCategoryProvider', () => {
  beforeEach(() => {
    consoleErrorFn = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorFn.mockRestore();
  });

  it('throws an error if used outside of ChecklistCountProvider', () => {
    expect(() =>
      render(<ChecklistCategoryProvider category={ISSUE_TYPES.DESIGN} />)
    ).toThrow(
      'Cannot use `ChecklistCategoryProvider` outside of `ChecklistCountProvider`'
    );
  });

  it('provides a method to add entries', () => {
    const ChecklistWrapper = ({ children }) => (
      <ChecklistCountProvider hasChecklist>
        <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
          {children}
        </ChecklistCategoryProvider>
      </ChecklistCountProvider>
    );
    const useContextValues = () => ({
      categoryContextValue: useContext(CategoryContext),
      countContextValue: useContext(CountContext),
    });
    const { result } = renderHook(() => useContextValues(), {
      wrapper: ChecklistWrapper,
    });
    act(() => {
      result.current.categoryContextValue({ testEntry: true });
    });
    const [categories] = result.current.countContextValue;
    expect(categories).toStrictEqual({
      [ISSUE_TYPES.PRIORITY]: {
        testEntry: true,
      },
      [ISSUE_TYPES.DESIGN]: {},
      [ISSUE_TYPES.ACCESSIBILITY]: {},
      hasChecklist: true,
    });
  });
});

describe('useRegisterCheck', () => {
  it('registers a check under a key', () => {
    const testKey = 'testKey';

    const ChecklistWrapper = ({ children }) => (
      <ChecklistCountProvider hasChecklist>
        <ChecklistCategoryProvider category={ISSUE_TYPES.PRIORITY}>
          {children}
        </ChecklistCategoryProvider>
      </ChecklistCountProvider>
    );
    const useCountContextAndRegisterHook = (isEntryRendered) => ({
      registerCheck: useRegisterCheck(testKey, isEntryRendered),
      countContextValue: useContext(CountContext),
    });
    const { result, rerender } = renderHook(
      (isEntryRendered) => useCountContextAndRegisterHook(isEntryRendered),
      {
        wrapper: ChecklistWrapper,
        initialProps: true,
      }
    );

    expect(result.current.countContextValue[0]).toStrictEqual({
      [ISSUE_TYPES.PRIORITY]: {
        [testKey]: true,
      },
      [ISSUE_TYPES.DESIGN]: {},
      [ISSUE_TYPES.ACCESSIBILITY]: {},
      hasChecklist: true,
    });

    rerender(false);
    expect(result.current.countContextValue[0]).toStrictEqual({
      [ISSUE_TYPES.PRIORITY]: {
        [testKey]: false,
      },
      [ISSUE_TYPES.DESIGN]: {},
      [ISSUE_TYPES.ACCESSIBILITY]: {},
      hasChecklist: true,
    });
  });
});
