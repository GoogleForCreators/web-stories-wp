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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFeatures } from 'flagged';
import { trackError } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useStory } from '../../app/story';
import { useConfig } from '../../app/config';
import { useCurrentUser } from '../../app/currentUser';
import PostLockDialog from './postLockDialog';
import PostTakeOverDialog from './postTakeOverDialog';

function PostLock() {
  const {
    actions: { getStoryLockById, setStoryLockById, deleteStoryLockById },
  } = useAPI();
  const {
    state: { currentUser },
  } = useCurrentUser();
  const {
    storyId,
    dashboardLink,
    postLock: { interval: postLockInterval, showLockedDialog },
  } = useConfig();

  const { previewLink } = useStory(({ state: { story: { previewLink } } }) => ({
    previewLink,
  }));
  const { enablePostLocking } = useFeatures();
  const [showDialog, setShowDialog] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [user, setUser] = useState({});
  const [nonce, setNonce] = useState('');

  // When dialog is closed, then set current user to lock owner.
  const closeDialog = useCallback(() => {
    setShowDialog(false);
    setStoryLockById(storyId);
  }, [setStoryLockById, storyId]);

  const currentUserLoaded = useMemo(
    () => Boolean(Object.keys(currentUser).length),
    [currentUser]
  );

  // When async call only if dialog is true, current user is loaded and post locking is enabled.
  const doGetStoryLock = useCallback(() => {
    if (enablePostLocking && showLockedDialog && currentUserLoaded) {
      getStoryLockById(storyId)
        .then((result) => {
          if (result.locked && result.user !== currentUser.id) {
            setShowDialog(true);
            setUser(result['_embedded'].author[0]);
          } else {
            setStoryLockById(storyId);
          }
          // Refresh notice on every request.
          setNonce(result.nonce);
        })
        .catch((err) => {
          trackError('post_lock', err.message);
        });
    }
  }, [
    getStoryLockById,
    setStoryLockById,
    setShowDialog,
    storyId,
    currentUser,
    enablePostLocking,
    showLockedDialog,
    currentUserLoaded,
  ]);

  // Cache it to make it stable in terms of the below timeout
  const cachedDoGetStoryLock = useRef(doGetStoryLock);
  useEffect(() => {
    cachedDoGetStoryLock.current = doGetStoryLock;
  }, [doGetStoryLock, currentUserLoaded]);

  // Register an event on user navigating away from current tab to release / delete lock.
  useEffect(() => {
    function releasePostLock() {
      if (enablePostLocking && showLockedDialog && !showDialog && nonce) {
        deleteStoryLockById(storyId, nonce);
      }
    }

    window.addEventListener('beforeunload', releasePostLock);

    return () => {
      window.removeEventListener('beforeunload', releasePostLock);
    };
  }, [
    deleteStoryLockById,
    storyId,
    enablePostLocking,
    showLockedDialog,
    showDialog,
    nonce,
  ]);

  // Register repeating callback to check lock every 150 seconds.
  useEffect(() => {
    if (currentUserLoaded) {
      cachedDoGetStoryLock.current();
    }

    const timeout = setInterval(() => {
      if (currentUserLoaded) {
        cachedDoGetStoryLock.current();
        setIsFirstTime(false);
      }
    }, postLockInterval * 1000);

    return () => clearInterval(timeout);
  }, [postLockInterval, currentUserLoaded]);

  // On first load, display dialog with option to take over.
  if (isFirstTime) {
    return (
      <PostLockDialog
        open={showDialog}
        user={user}
        onClose={closeDialog}
        previewLink={previewLink}
        dashboardLink={dashboardLink}
      />
    );
  }

  // Second time around, show message that dialog was taken over.
  return (
    <PostTakeOverDialog
      open={showDialog}
      user={user}
      dashboardLink={dashboardLink}
      onClose={closeDialog}
    />
  );
}

export default PostLock;
