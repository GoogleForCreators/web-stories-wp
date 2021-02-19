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
import { useCallback, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { Plain } from '../../../../button';
import Dialog from '../../../../dialog';
import localStore, {
  LOCAL_STORAGE_PREFIX,
} from '../../../../../utils/localStore';
import { useCurrentUser } from '../../../../../app/currentUser';

function VideoOptimizationDialog() {
  const [hasOptedIn, setHasOptedIn] = useState(
    Boolean(
      localStore.getItemByKey(
        `${LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_OPTIN}`
      )
    )
  );

  const { currentUser, updateCurrentUser } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      updateCurrentUser: actions.updateCurrentUser,
    })
  );

  const isTranscodingEnabled = Boolean(
    currentUser.meta?.web_stories_media_optimization
  );

  const setHasOptedInValue = useCallback((value) => {
    setHasOptedIn(value);
    localStore.setItemByKey(
      `${LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_OPTIN}`,
      value
    );
  }, []);

  const onDisable = useCallback(() => {
    updateCurrentUser({
      meta: {
        web_stories_media_optimization: false,
      },
    });
    setHasOptedInValue(true);
  }, [updateCurrentUser, setHasOptedInValue]);

  const onClose = useCallback(() => {
    setHasOptedInValue(true);
  }, [setHasOptedInValue]);

  const dialogTitle = __('Video optimization in progress', 'web-stories');
  const dialogDescription = __(
    'This process can’t be stopped once it begins. Optimization is automatically enabled for all videos to ensure smooth playback. You can disable optimization any time in Settings.',
    'web-stories'
  );

  return (
    <Dialog
      open={isTranscodingEnabled && !hasOptedIn}
      onClose={onClose}
      title={dialogTitle}
      actions={
        <>
          <Plain onClick={onDisable}>
            {__('Disable optimization', 'web-stories')}
          </Plain>
          <Plain onClick={onClose}>{__('Sounds good', 'web-stories')}</Plain>
        </>
      }
      maxWidth={512}
    >
      {dialogDescription}
    </Dialog>
  );
}

export default VideoOptimizationDialog;
