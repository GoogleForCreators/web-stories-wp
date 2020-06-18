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
import { useCallback, useState } from 'react';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import getStoryPropsToSave from '../utils/getStoryPropsToSave';

/**
 * Custom hook to auto-save a story.
 *
 * @param {Object}    properties Properties to update.
 * @param {number}    properties.storyId Story post id.
 * @param {Array}     properties.pages Array of all pages.
 * @param {Object}    properties.story Story-global properties
 * @return {Function} Function that can be called to save a story.
 */
function useAutoSave({ storyId, pages, story }) {
  const {
    actions: { autoSaveById },
  } = useAPI();
  const { metadata } = useConfig();
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const flags = useFeatures();

  const autoSave = useCallback(
    (props) => {
      setIsAutoSaving(true);
      return autoSaveById({
        storyId,
        ...getStoryPropsToSave({ story, pages, metadata, flags }),
        ...props,
      }).finally(() => setIsAutoSaving(false));
    },
    [story, pages, metadata, autoSaveById, storyId, flags]
  );

  return { autoSave, isAutoSaving };
}

export default useAutoSave;
