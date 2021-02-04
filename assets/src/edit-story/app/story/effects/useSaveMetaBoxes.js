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
import { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { useMetaBoxes } from '../../../integrations/wordpress/metaBoxes';
import usePrevious from '../../../utils/usePrevious';
import { useAPI } from '../../api';

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
  const { hasMetaBoxes, locations } = useMetaBoxes(({ state }) => ({
    hasMetaBoxes: state.hasMetaBoxes,
    locations: state.locations,
  }));

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
        ...locations.map(
          (location) =>
            new global.FormData(
              document.querySelector(`.metabox-location-${location}`) ||
                undefined
            )
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
    hasMetaBoxes,
    story,
    isSaving,
    wasSaving,
    isAutoSaving,
    wasAutoSaving,
    isSavingMetaBoxes,
    saveMetaBoxes,
    locations,
  ]);

  return {
    isSavingMetaBoxes,
  };
}

export default useSaveMetaBoxes;
