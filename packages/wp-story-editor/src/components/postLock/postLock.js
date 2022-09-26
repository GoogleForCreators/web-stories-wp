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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import { useFeatures } from 'flagged';
import { trackError } from '@googleforcreators/tracking';
import {
  useStory,
  useConfig,
  useCurrentUser,
} from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import {
  getStoryLockById,
  setStoryLockById,
  deleteStoryLockById,
} from '../../api/storyLock';
import PostLockDialog from './postLockDialog';
import PostTakeOverDialog from './postTakeOverDialog';

function PostLock() {
  const { currentUser } = useCurrentUser(({ state }) => ({
    currentUser: state.currentUser,
  }));
  const {
    storyId,
    dashboardLink,
    nonce: firstNonce,
    postLock: { interval: postLockInterval, showLockedDialog },
    api: { stories, storyLocking },
  } = useConfig();

  const { previewLink, lockUser } = useStory(
    ({
      state: {
        story: { previewLink, extras: { lockUser = {} } = {} },
      },
    }) => ({
      previewLink,
      lockUser,
    })
  );

  const { enablePostLockingTakeOver } = useFeatures();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [user, setUser] = useState({});
  const [nonce, setNonce] = useState(firstNonce);

  // When dialog is closed, then set current user to lock owner.
  const closeDialog = useCallback(() => {
    if (!enablePostLockingTakeOver) {
      return;
    }
    setUser({});
    setStoryLockById(storyId, stories);
  }, [enablePostLockingTakeOver, storyId, stories]);

  const currentUserLoaded = useMemo(
    () => Boolean(Object.keys(currentUser).length),
    [currentUser]
  );

  // When async call only if dialog is true, current user is loaded and post locking is enabled.
  const doGetStoryLock = useCallback(() => {
    if (showLockedDialog && currentUserLoaded) {
      getStoryLockById(storyId, stories)
        .then(({ locked, nonce: newNonce, _embedded }) => {
          const lockAuthor = {
            id: _embedded?.author?.[0]?.id || 0,
            name: _embedded?.author?.[0]?.name || '',
            avatar: _embedded?.author?.[0]?.avatar_urls?.['96'] || '',
          };
          if (locked && lockAuthor?.id && lockAuthor?.id !== currentUser.id) {
            setUser(lockAuthor);
          } else {
            setStoryLockById(storyId, stories);
          }
          // Refresh nonce on every request.
          setNonce(newNonce);
        })
        .catch((err) => {
          trackError('post_lock', err.message);
        });
    }
  }, [
    setUser,
    storyId,
    stories,
    currentUser,
    showLockedDialog,
    currentUserLoaded,
  ]);

  // Cache it to make it stable in terms of the below timeout
  const cachedDoGetStoryLock = useRef(doGetStoryLock);
  useEffect(() => {
    cachedDoGetStoryLock.current = doGetStoryLock;
  }, [doGetStoryLock, currentUserLoaded]);

  useEffect(() => {
    if (showLockedDialog && currentUserLoaded) {
      if (lockUser?.id && lockUser?.id !== currentUser.id) {
        setUser(lockUser);
      }
    }
  }, [lockUser, currentUser, currentUserLoaded, showLockedDialog]);

  // Register an event on user navigating away from current tab to release / delete lock.
  useEffect(() => {
    function releasePostLock() {
      if (showLockedDialog && user?.id && nonce) {
        deleteStoryLockById(storyId, nonce, storyLocking);
      }
    }

    window.addEventListener('beforeunload', releasePostLock);

    return () => {
      window.removeEventListener('beforeunload', releasePostLock);
    };
  }, [storyId, showLockedDialog, user, nonce, storyLocking]);

  // Register repeating callback to check lock every 150 seconds.
  useEffect(() => {
    const timeout = setInterval(() => {
      if (!postLockInterval) {
        return;
      }
      if (currentUserLoaded) {
        cachedDoGetStoryLock.current();
        setIsFirstTime(false);
      }
    }, postLockInterval * 1000);

    return () => clearInterval(timeout);
  }, [postLockInterval, currentUserLoaded]);

  if (!showLockedDialog || !user) {
    return null;
  }

  // On first load, display dialog with option to take over.
  if (isFirstTime) {
    return (
      <PostLockDialog
        isOpen={Boolean(user?.id)}
        user={user}
        onClose={closeDialog}
        previewLink={previewLink}
        dashboardLink={dashboardLink}
        showTakeOver={enablePostLockingTakeOver}
      />
    );
  }

  // Second time around, show message that story was taken over.
  if (enablePostLockingTakeOver) {
    return (
      <PostTakeOverDialog
        isOpen={Boolean(user?.id)}
        user={user}
        dashboardLink={dashboardLink}
        onClose={closeDialog}
      />
    );
  }

  return null;
}

export default PostLock;
