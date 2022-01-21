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
import PropTypes from 'prop-types';
import {
  useMemo,
  useRef,
  useCallback,
  useState,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../utils/idleCallback';
import storyPageToDataUrl from '../../utils/storyPageToDataUrl';
import Context from './context';

/**
 * @typedef {import('../../types.js').Page} Page
 */

function PageDataUrlProvider({ children }) {
  const [dataUrls, setDataUrls] = useState({});
  const taskQueue = useRef([]);
  const isTaskQueueRunning = useRef(false);
  const currentTask = useRef([null, null]);

  /**
   * Recursively runs the image generation task queue sequentially
   * until all queued dataUrls are generated.
   *
   * @return {void}
   */
  const runTaskQueue = useCallback(() => {
    isTaskQueueRunning.current = true;

    if (!taskQueue.current.length) {
      isTaskQueueRunning.current = false;
      return;
    }

    const [pageId, generationTask] = taskQueue.current.shift();
    const idleCallbackId = requestIdleCallback(async () => {
      await generationTask();
      currentTask.current = [null, null];
      runTaskQueue();
    });
    currentTask.current = [pageId, idleCallbackId];
  }, []);

  /**
   * Clears queue of any tasks associated with the
   * given page id.
   *
   * @param {string} id story page id
   * @return {void}
   */
  const clearQueueOfPageTask = useCallback(
    (id) => {
      // Remove any queued tasks associated with this page Id
      taskQueue.current = taskQueue.current.filter(
        ([storyPageId]) => storyPageId !== id
      );

      // If the current requested task hasn't fired, clear it
      // and restart the queue on the next task
      const [pageId, idleCallbackId] = currentTask.current;
      if (id === pageId) {
        cancelIdleCallback(idleCallbackId);
        currentTask.current = [null, null];
        runTaskQueue();
      }
    },
    [runTaskQueue]
  );

  /**
   * Add page image generation task to a background task
   * queue.
   *
   * @param {Page} storyPage Page object.
   * @return {Function} function to cancel image generation request
   */
  const queuePageImageGeneration = useCallback(
    (storyPage) => {
      // Clear queue of any stale requests to generate the page image
      clearQueueOfPageTask(storyPage.id);

      // Add request to generate page image generation queue
      taskQueue.current.push([
        storyPage.id,
        async () => {
          const dataUrl = await storyPageToDataUrl(storyPage, {});
          setDataUrls((state) => ({
            ...state,
            [storyPage.id]: dataUrl,
          }));
        },
      ]);

      // If the queue has stopped processing because
      // it ran out of entries, restart it
      if (!isTaskQueueRunning.current) {
        runTaskQueue();
      }

      return () => {
        clearQueueOfPageTask(storyPage.id);
      };
    },
    [runTaskQueue, clearQueueOfPageTask]
  );

  const value = useMemo(
    () => ({
      state: {
        dataUrls,
      },
      actions: {
        queuePageImageGeneration,
      },
    }),
    [queuePageImageGeneration, dataUrls]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
PageDataUrlProvider.propTypes = {
  children: PropTypes.node,
};

export default PageDataUrlProvider;
