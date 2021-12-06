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
import { useMemo, useRef, useCallback, useState } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import {
  requestIdleCallback,
  cancelIdleCallback,
} from '../../utils/idleCallback';
import storyPageToBlob from '../../utils/storyPageToBlob';
import Context from './context';

/**
 * @typedef {import('../../types.js').Page} Page
 */

function PageBlobsProvider({ children }) {
  const blobs = useState({});
  const blobTaskQueue = useRef([]);
  const isBlobTaskQueueRunning = useRef(false);
  const currentTask = useRef([null, null]);

  /**
   * Recursively runs the blob task queue sequentially
   * until all queued blobs are generated.
   *
   * @return {void}
   */
  const runBlobTaskQueue = useCallback(() => {
    isBlobTaskQueueRunning.current = true;

    if (!blobTaskQueue.current.length) {
      isBlobTaskQueueRunning.current = false;
      return;
    }

    const [pageId, generationTask] = blobTaskQueue.current.shift();
    const idleCallbackId = requestIdleCallback(async () => {
      await generationTask();
      currentTask.current = [null, null];
      runBlobTaskQueue();
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
      blobTaskQueue.current = blobTaskQueue.current.filter(
        ([storyPageId]) => storyPageId !== id
      );

      // If the current requested task hasn't fired, clear it
      // and restart the queue on the next task
      const [pageId, idleCallbackId] = currentTask.current;
      if (id === pageId) {
        cancelIdleCallback(idleCallbackId);
        currentTask.current = [null, null];
        runBlobTaskQueue();
      }
    },
    [runBlobTaskQueue]
  );

  /**
   * Add page blob generation task to a background task
   * queue.
   *
   * @param {Page} storyPage Page object.
   * @return {Function} function to cancel blob generation request
   */
  const queuePageBlobGeneration = useCallback(
    (storyPage) => {
      // Clear queue of any stale requests to generate the page blob
      clearQueueOfPageTask(storyPage.id);

      // Add request to generate page blob to queue
      blobTaskQueue.current.push([
        storyPage.id,
        async () => {
          const blob = await storyPageToBlob(storyPage);
          return blob;
        },
      ]);

      // If the queue has stopped processing because
      // it ran out of entries, restart it
      if (!isBlobTaskQueueRunning.current) {
        runBlobTaskQueue();
      }

      return () => {
        clearQueueOfPageTask(storyPage.id);
      };
    },
    [runBlobTaskQueue, clearQueueOfPageTask]
  );

  const value = useMemo(
    () => ({
      state: {
        blobs,
      },
      actions: {
        queuePageBlobGeneration,
      },
    }),
    [queuePageBlobGeneration, blobs]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
PageBlobsProvider.propTypes = {
  children: PropTypes.node,
};

export default PageBlobsProvider;
