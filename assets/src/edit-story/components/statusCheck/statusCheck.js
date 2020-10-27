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
import { useCallback, useEffect } from 'react';
import { useFeatures } from 'flagged';
/**
 * Internal dependencies
 */
import { useAPI, useConfig, useStory } from '../../app';
import getStoryMarkup from '../../output/utils/getStoryMarkup';

function StatusCheck() {
  const {
    actions: { getStatusCheck },
  } = useAPI();

  const { metadata } = useConfig();
  const flags = useFeatures();
  const { statusCheck } = flags;

  const { story, pages } = useStory((state) => ({
    story: state.state.story,
    pages: state.state.pages,
  }));

  const doStatusCheck = useCallback(() => {
    if (statusCheck && story && story.status && pages) {
      const content = getStoryMarkup(story, pages, metadata, flags);
      getStatusCheck(content)
        .then(() => {
          // @todo, check response.
        })
        .catch(() => {
          // @todo, show error message.
        })
        .finally(() => {
          // @todo, set final state.
        });
    }
  }, [getStatusCheck, statusCheck, story, pages, metadata, flags]);

  useEffect(doStatusCheck, [doStatusCheck]);

  return null;
}
export default StatusCheck;
