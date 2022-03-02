/*
 * Copyright 2022 Google LLC
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
import { useEffect, useCallback, useState } from '@googleforcreators/react';
import {
  useStory,
  useConfig,
  useAPI,
  getInUseFontsForPages,
} from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import { useFeature } from 'flagged';
import { FontCheckDialog } from './fontCheckDialog';

export const FontCheck = () => {
  const { dashboardLink } = useConfig();
  const notifyDeletedFonts = useFeature('notifyDeletedFonts');
  const { isStoryLoaded } = useStory(({ state: { pages } }) => ({
    isStoryLoaded: pages.length > 0,
  }));
  const storyPages = useStory(({ state: { pages } }) => pages);

  const {
    actions: { getFonts },
  } = useAPI();

  const [missingFont, setMissingFont] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const closeAndRedirect = useCallback(
    (evt) => {
      if (evt) {
        // redirect when clicking outside the dialog
        window.location = dashboardLink;
      }
    },
    [dashboardLink]
  );

  const closeDialog = () => setShowDialog(false);

  useEffect(() => {
    (async () => {
      if (!isStoryLoaded) {
        return;
      }

      const inUseFonts = getInUseFontsForPages(storyPages);
      const allFonts = await getFonts({ include: inUseFonts.join(',') });

      const diff = inUseFonts.filter(
        (x) => !new Set(allFonts.map((font) => font.family)).has(x)
      );

      if (diff && diff.length >= 1) {
        setShowDialog(true);
        setMissingFont(diff[0]);
      }
    })();
  }, [isStoryLoaded, storyPages, getFonts]);

  if (!notifyDeletedFonts) {
    return null;
  }

  return (
    <FontCheckDialog
      isOpen={showDialog}
      missingFont={missingFont || ''}
      defaultCloseAction={closeAndRedirect}
      closeDialog={closeDialog}
    />
  );
};

export default FontCheck;
