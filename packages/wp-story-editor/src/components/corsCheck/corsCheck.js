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
import { useAPI } from '@googleforcreators/story-editor';
import { trackError } from '@googleforcreators/tracking';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import CorsCheckFailed from './corsCheckFailed';

function CorsCheck() {
  const [showDialog, setShowDialog] = useState(false);
  const closeDialog = useCallback(() => setShowDialog(false), []);
  const {
    actions: { getMediaForCorsCheck },
  } = useAPI();
  const enableCORSCheck = useFeature('enableCORSCheck');
  useEffect(() => {
    (async () => {
      if (!enableCORSCheck) {
        return;
      }
      let mediaItems;
      try {
        mediaItems = await getMediaForCorsCheck();
      } catch (err) {
        return;
      }
      if (!mediaItems?.length) {
        return;
      }
      try {
        await Promise.all(
          [
            ...new Set(
              mediaItems.filter((url) => !url.startsWith(location.origin))
            ),
          ].map((url) => fetch(url, { method: 'HEAD' }))
        );
      } catch (err) {
        setShowDialog(true);
        trackError('cors_check', err.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run this effect once, so do not pass dependencies.
  }, []);

  return <CorsCheckFailed isOpen={showDialog} onClose={closeDialog} />;
}

export default CorsCheck;
