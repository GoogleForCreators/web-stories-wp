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
import { useEffect, useRef, useState } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';

/**
 * Function returning the current Meta Boxes DOM Node in the editor
 * whether the meta box area is opened or not.
 * If the MetaBox Area is visible returns it, and returns the original container instead.
 *
 * @param {string} location Meta Box location.
 * @return {Element} Container
 */
function getMetaBoxContainer(location) {
  // Class name as set in <MetaBoxesArea>
  const area = document.querySelector(
    `.web-stories-meta-boxes-area-${location} .metabox-location-${location}`
  );
  if (area) {
    return area;
  }

  return document.querySelector('#metaboxes .metabox-location-' + location);
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useSaveMetaBoxes({ story, isSaving, isAutoSaving }) {
  const isFeatureEnabled = useFeature('customMetaBoxes');

  const {
    actions: { saveMetaBoxes },
  } = useAPI();

  const [isSavingMetaBoxes, setIsSavingMetaBoxes] = useState(false);

  const wasSaving = usePrevious(isSaving);
  const wasAutoSaving = usePrevious(isAutoSaving);

  // Save metaboxes when performing a full save on the post.
  // TODO: only do this when there are actually meta boxes.
  useEffect(() => {
    // Save metaboxes on save completion, except for autosaves that are not a post preview.
    if (
      !isFeatureEnabled ||
      isSaving ||
      isAutoSaving ||
      isSavingMetaBoxes ||
      !wasSaving ||
      wasAutoSaving
    ) {
      return;
    }

    async function save() {
      // Saves the wp_editor fields.
      global.tinyMCE?.triggerSave();

      // We gather all the metaboxes locations data and the base form data.
      const baseFormData = new window.FormData(
        document.querySelector('.metabox-base-form')
      );

      const formDataToMerge = [
        baseFormData,
        ...['normal', 'advanced'].map(
          (location) => new window.FormData(getMetaBoxContainer(location))
        ),
      ];

      // Merge all form data objects into a single one.
      const formData = formDataToMerge.reduce((acc, currentFormData) => {
        for (const [key, value] of currentFormData) {
          acc.append(key, value);
        }
        return acc;
      }, new window.FormData());

      setIsSavingMetaBoxes(true);
      await saveMetaBoxes(story, formData);
      setIsSavingMetaBoxes(false);
    }

    save();
  }, [
    isFeatureEnabled,
    story,
    isSaving,
    wasSaving,
    isAutoSaving,
    wasAutoSaving,
    isSavingMetaBoxes,
    saveMetaBoxes,
  ]);

  return {
    isSavingMetaBoxes,
  };
}

export default useSaveMetaBoxes;
