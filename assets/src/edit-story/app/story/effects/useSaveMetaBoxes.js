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
import { useConfig } from '../../config';

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

  return (
    area || document.querySelector('#metaboxes .metabox-location-' + location)
  );
}

// Returns a prop's previous value.
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Effect to save meta boxes for a story.
 *
 * @see https://github.com/WordPress/gutenberg/blob/148e2b28d4cdd4465c4fe68d97fcee154a6b209a/packages/edit-post/src/store/effects.js#L24-L126
 *
 * @param {Object} props Hook props.
 * @param {Object} props.story Story object.
 * @param {boolean} props.isSaving Whether saving is in progress.
 * @param {boolean} props.isAutoSaving Whether autosaving is in progress.
 * @return {{isSavingMetaBoxes: boolean}} Metaboxes status.
 */
function useSaveMetaBoxes({ story, isSaving, isAutoSaving }) {
  const isFeatureEnabled = useFeature('customMetaBoxes');
  const { metaBoxes = {} } = useConfig();

  const locations = ['normal', 'advanced'];
  const hasMetaBoxes = locations.some((location) =>
    Boolean(metaBoxes[location]?.length)
  );

  const {
    actions: { saveMetaBoxes },
  } = useAPI();

  const [isSavingMetaBoxes, setIsSavingMetaBoxes] = useState(false);

  const wasSaving = usePrevious(isSaving);
  const wasAutoSaving = usePrevious(isAutoSaving);

  // Save metaboxes when performing a full save on the post.
  useEffect(() => {
    if (
      !hasMetaBoxes ||
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
      const baseFormElement = document.querySelector('.metabox-base-form');
      const baseFormData = new global.FormData(baseFormElement || undefined);

      const formDataToMerge = [
        baseFormData,
        ...['normal', 'advanced'].map(
          (location) =>
            new global.FormData(getMetaBoxContainer(location) || undefined)
        ),
      ];

      // Merge all form data objects into a single one.
      const formData = formDataToMerge.reduce((acc, currentFormData) => {
        for (const [key, value] of currentFormData) {
          acc.append(key, value);
        }
        return acc;
      }, new global.FormData());

      setIsSavingMetaBoxes(true);
      await saveMetaBoxes(story, formData);
      setIsSavingMetaBoxes(false);
    }

    save();
  }, [
    isFeatureEnabled,
    hasMetaBoxes,
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
