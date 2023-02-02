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
import type { Page } from '@googleforcreators/elements';
import { useMemo, useCallback, useState } from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import useIdleTaskQueue from '../../utils/useIdleTaskQueue';
import storyPageToDataUrl from '../pageCanvas/utils/storyPageToDataUrl';
import type { PageDataUrls, QueuePageImageGeneration } from '../../types';
import Context from './context';

function PageDataUrlProvider({ children }: PropsWithChildren<unknown>) {
  const [dataUrls, setDataUrls] = useState<PageDataUrls>({});
  const queueIdleTask = useIdleTaskQueue();

  /**
   * Add page image generation task to a idle task
   * queue.
   */
  const queuePageImageGeneration: QueuePageImageGeneration = useCallback(
    (storyPage: Page) => {
      const idleTaskUid: string = storyPage.id;
      const idleTask: () => Promise<void> = async () => {
        try {
          const dataUrl = await storyPageToDataUrl(storyPage, {});
          setDataUrls((state) => ({
            ...state,
            [storyPage?.id]: dataUrl,
          }));
        } catch {
          // Do nothing for now.
        }
      };

      const clearQueueOfPageTask = queueIdleTask({
        taskId: idleTaskUid,
        task: idleTask,
      });
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

export default PageDataUrlProvider;
