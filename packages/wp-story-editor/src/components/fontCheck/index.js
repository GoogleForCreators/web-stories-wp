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
import { FontCheckDialog } from './fontCheckDialog';

export const FontCheck = () => {
  const { dashboardLink } = useConfig();
  const { isStoryLoaded, storyPages, updateElementsByFontFamily } = useStory(
    ({ state: { pages }, actions }) => ({
      storyPages: pages,
      updateElementsByFontFamily: actions.updateElementsByFontFamily,
      isStoryLoaded: pages.length > 0,
    })
  );
  const {
    actions: { getFonts },
  } = useAPI();

  const [missingFont, setMissingFont] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const closeAndRedirect = useCallback(() => {
    window.location = dashboardLink;
  }, [dashboardLink]);

  const closeDialog = () => setShowDialog(false);

  useEffect(
    () => {
      (async () => {
        if (!isStoryLoaded) {
          return;
        }

        const inUseFonts = getInUseFontsForPages(storyPages);
        const allFonts = await getFonts({ include: inUseFonts.join(',') });
        for (const fontFamily of inUseFonts) {
          const matchedFont = allFonts.find(
            (font) => font?.family === fontFamily
          );
          if (matchedFont) {
            // ensure `in use` font element uses the latest metrics, weights etc...
            updateElementsByFontFamily({
              family: fontFamily,
              properties: { font: matchedFont },
            });
          }
        }

        const diff = inUseFonts.filter(
          (x) => !new Set(allFonts.map((font) => font.family)).has(x)
        );

        if (diff && diff.length >= 1) {
          setShowDialog(true);
          setMissingFont(diff[0]);
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this once after the story is loaded
    [isStoryLoaded, updateElementsByFontFamily]
  );

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
