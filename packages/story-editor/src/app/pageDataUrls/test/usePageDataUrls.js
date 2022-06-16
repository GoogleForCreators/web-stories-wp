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
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { usePageDataUrls, PageDataUrlProvider } from '..';
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../../utils/idleCallback';

const mockDataUrlFromPage = (page) => `${page.id}-dataUrl`;

jest.mock('../../../utils/idleCallback', () => {
  return {
    __esModule: true,
    requestIdleCallback: jest.fn(),
    cancelIdleCallback: jest.fn(),
  };
});

jest.mock('../../../utils/storyPageToDataUrl', () => {
  return {
    __esModule: true,
    // make dataUrl generation predictable
    default: jest.fn((page) => Promise.resolve(mockDataUrlFromPage(page))),
  };
});

function setup() {
  const wrapper = ({ children }) => (
    <PageDataUrlProvider>{children}</PageDataUrlProvider>
  );

  return renderHook(() => usePageDataUrls(), { wrapper });
}

describe('usePageDataUrls', () => {
  let mockIdleCallbacks, runIdleCallbacks;

  beforeEach(() => {
    mockIdleCallbacks = [];
    runIdleCallbacks = () => {
      while (mockIdleCallbacks.length > 0) {
        const [, callback] = mockIdleCallbacks.shift();
        callback();
      }
    };

    requestIdleCallback.mockImplementation((callback) => {
      const idleCallbackId = Symbol();
      mockIdleCallbacks.push([idleCallbackId, callback]);
      return idleCallbackId;
    });
    cancelIdleCallback.mockImplementation((idleCallbackId) => {
      mockIdleCallbacks = mockIdleCallbacks.filter(
        ([id]) => id !== idleCallbackId
      );
    });
  });

  describe('queuePageImageGeneration', () => {
    it('generates page data Urls sequentially', async () => {
      const runAllIdleCallbacks = async () => {
        runIdleCallbacks();
        await act(async () => {
          await Promise.resolve();
        });
      };

      const { result } = setup();
      const pageA = { id: 'a' };
      const pageB = { id: 'b' };
      const pageC = { id: 'b' };

      // queue dataUrl generation tasks
      result.current.actions.queuePageImageGeneration(pageA);
      result.current.actions.queuePageImageGeneration(pageB);
      result.current.actions.queuePageImageGeneration(pageC);

      // see that no dataUrls have been generated
      expect(result.current.state.dataUrls).toStrictEqual({});

      // run idleCallback tasks and see that page dataUrl only gets
      // generated when idle callback tasks are run. Also see that
      // dataUrl generation functions in a first in first out (FIFO)
      // manner
      await runAllIdleCallbacks();
      expect(result.current.state.dataUrls).toStrictEqual({
        [pageA.id]: mockDataUrlFromPage(pageA),
      });

      await runAllIdleCallbacks();
      expect(result.current.state.dataUrls).toStrictEqual({
        [pageA.id]: mockDataUrlFromPage(pageA),
        [pageB.id]: mockDataUrlFromPage(pageB),
      });

      await runAllIdleCallbacks();
      expect(result.current.state.dataUrls).toStrictEqual({
        [pageA.id]: mockDataUrlFromPage(pageA),
        [pageB.id]: mockDataUrlFromPage(pageB),
        [pageC.id]: mockDataUrlFromPage(pageC),
      });
    });
  });
});
