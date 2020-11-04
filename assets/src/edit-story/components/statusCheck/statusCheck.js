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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useCallback, useEffect } from 'react';
import { useFeatures } from 'flagged';
/**
 * Internal dependencies
 */
import { useAPI, useConfig } from '../../app';
import getStoryMarkup from '../../output/utils/getStoryMarkup';

function StatusCheck() {
  const {
    actions: { getStatusCheck },
  } = useAPI();

  const { metadata } = useConfig();
  const flags = useFeatures();
  const { statusCheck } = flags;

  const doStatusCheck = useCallback(() => {
    if (statusCheck) {
      const story = {
        storyId: 1,
        title: 'Story!',
        author: 1,
        slug: 'story',
        publisherLogo: 1,
        defaultPageDuration: 7,
        status: 'publish',
        date: '2020-04-10T07:06:26',
        modified: '',
        excerpt: '',
        featuredMedia: 0,
        password: '',
        stylePresets: '',
      };
      const pages = [
        {
          type: 'page',
          id: '2',
          elements: [],
        },
      ];
      const content = getStoryMarkup(story, pages, metadata, flags);
      getStatusCheck(content)
        .then(() => {
          // eslint-disable-next-line no-console
          console.log(__('Status Check successful.', 'web-stories'));
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log(__('Status Check failure.', 'web-stories'));
        })
        .finally(() => {
          // eslint-disable-next-line no-console
          console.log(__('Status Check finished.', 'web-stories'));
        });
    }
  }, [getStatusCheck, statusCheck, metadata, flags]);

  useEffect(doStatusCheck, [doStatusCheck]);

  return null;
}
export default StatusCheck;
