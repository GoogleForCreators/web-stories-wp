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
import { act, renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useLiveRegion from '../useLiveRegion';
import { queryById } from '../../testUtils';

describe('useLiveRegion', () => {
  it('should add message to live region', () => {
    const { result } = renderHook(() => useLiveRegion());

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toBeEmptyDOMElement();

    act(() => {
      result.current('Hello World');
    });

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toHaveTextContent('Hello World');
  });

  it('should change the politeness of the message', () => {
    const { result } = renderHook(() => useLiveRegion('assertive'));

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).not.toBeInTheDocument();
    expect(
      queryById(
        document.documentElement,
        'web-stories-aria-live-region-assertive'
      )
    ).toBeEmptyDOMElement();

    act(() => result.current('Hello World'));

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).not.toBeInTheDocument();
    expect(
      queryById(
        document.documentElement,
        'web-stories-aria-live-region-assertive'
      )
    ).toHaveTextContent('Hello World');
  });

  it('should remove container when unmounting', () => {
    const { unmount } = renderHook(() => useLiveRegion());

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toBeEmptyDOMElement();

    unmount();

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).not.toBeInTheDocument();
  });

  it('should clear existing messages', () => {
    const { result } = renderHook(() => useLiveRegion());

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toBeEmptyDOMElement();

    act(() => {
      result.current('Foo');
      result.current('Bar');
    });

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).not.toHaveTextContent('Foo');
    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toHaveTextContent('Bar');
  });

  it('should not add multiple containers', () => {
    renderHook(() => {
      useLiveRegion();
      useLiveRegion();
    });

    expect(
      queryById(document.documentElement, 'web-stories-aria-live-region-polite')
    ).toBeEmptyDOMElement();
  });
});
