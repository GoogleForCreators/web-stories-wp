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
import { useMemo, useCallback, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useIdleTaskQueue from '../../utils/useIdleTaskQueue';
import storyPageToDataUrl from '../../utils/storyPageToDataUrl';
import Context from './context';

/**
 * @typedef {import('../../types.js').Page} Page
 */

function PageDataUrlProvider({ children }) {
  const [dataUrls, setDataUrls] = useState({});
  const queueIdleTask = useIdleTaskQueue();

  /**
   * Add page image generation task to a idle task
   * queue.
   *
   * @param {Page} storyPage Page object.
   * @return {Function} function to cancel image generation request
   */
  const queuePageImageGeneration = useCallback(
    (storyPage) => {
      const idleTaskUid = storyPage.id;
      const idleTask = async () => {
        const dataUrl = await storyPageToDataUrl(storyPage, {});
        setDataUrls((state) => ({
          ...state,
          [storyPage.id]: dataUrl,
        }));
      };

      const clearQueueOfPageTask = queueIdleTask([idleTaskUid, idleTask]);
      return () => {
        clearQueueOfPageTask();
      };
    },
    [queueIdleTask]
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
