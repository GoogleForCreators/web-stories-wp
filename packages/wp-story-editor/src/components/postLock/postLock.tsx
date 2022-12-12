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
import { trackError } from '@googleforcreators/tracking';
import {
  useStory,
  useConfig,
  useCurrentUser,
  useHistory,
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

  const {
    state: { hasNewChanges },
  } = useHistory();

  const { previewLink, lockUser, autoSave } = useStory(
    ({
      state: {
        story: { previewLink, extras: { lockUser = {} } = {} },
      },
      actions: { autoSave },
    }) => ({
      previewLink,
      lockUser,
      autoSave,
    })
  );
  const [currentOwner, setCurrentOwner] = useState(null);
  const [initialOwner, setInitialOwner] = useState(null);
  const [autoSaveDoneWhenTakenOver, setAutoSaveDoneWhenTakenOver] =
    useState(false);
  const [nonce, setNonce] = useState(firstNonce);

  // When dialog is closed, then set current user to lock owner.
  const closeDialog = useCallback(() => {
    setCurrentOwner(null);
    setStoryLockById(storyId, stories);
  }, [storyId, stories]);

  const currentUserLoaded = useMemo(
    () => currentUser && Boolean(Object.keys(currentUser).length),
    [currentUser]
  );

  // When async call only if dialog is true, current user is loaded and post locking is enabled.
  const doGetStoryLock = useCallback(() => {
    (async () => {
      if (showLockedDialog && currentUserLoaded) {
        try {
          const {
            locked,
            nonce: newNonce,
            user,
          } = await getStoryLockById(storyId, stories);
          const lockAuthor = {
            ...user,
            avatar: user?.avatar?.['96'] || '',
          };
          if (locked && initialOwner === null) {
            setInitialOwner(lockAuthor);
          }
          if (locked && lockAuthor?.id && lockAuthor?.id !== currentUser.id) {
            setCurrentOwner(lockAuthor);
          } else {
            setStoryLockById(storyId, stories);
          }
          // Refresh nonce on every request.
          setNonce(newNonce);
        } catch (err) {
          trackError('post_lock', err.message);
        }
      }
    })();
  }, [
    setCurrentOwner,
    storyId,
    stories,
    currentUser,
    initialOwner,
    setInitialOwner,
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
        setCurrentOwner(lockUser);
      }
    }
  }, [lockUser, currentUser, currentUserLoaded, showLockedDialog]);

  // Register an event on user navigating away from current tab to release / delete lock.
  useEffect(() => {
    function releasePostLock() {
      if (showLockedDialog && currentOwner?.id && nonce) {
        deleteStoryLockById(storyId, nonce, storyLocking);
      }
    }

    window.addEventListener('beforeunload', releasePostLock);

    return () => {
      window.removeEventListener('beforeunload', releasePostLock);
    };
  }, [storyId, showLockedDialog, currentOwner, nonce, storyLocking]);

  // Register repeating callback to check lock every 150 seconds.
  useEffect(() => {
    const timeout = setInterval(() => {
      if (!postLockInterval) {
        return;
      }
      if (currentUserLoaded) {
        cachedDoGetStoryLock.current();
      }
    }, postLockInterval * 1000);

    return () => clearInterval(timeout);
  }, [postLockInterval, currentUserLoaded]);

  useEffect(() => {
    if (
      showLockedDialog &&
      hasNewChanges &&
      currentUser?.id === initialOwner?.id &&
      currentOwner &&
      currentOwner?.id !== currentUser?.id &&
      !autoSaveDoneWhenTakenOver
    ) {
      autoSave();
      setAutoSaveDoneWhenTakenOver(true);
    }
  }, [
    hasNewChanges,
    showLockedDialog,
    currentOwner,
    initialOwner,
    currentUser,
    autoSave,
    autoSaveDoneWhenTakenOver,
    setAutoSaveDoneWhenTakenOver,
  ]);

  if (!showLockedDialog || !currentOwner) {
    return null;
  }

  // On first load, display dialog with option to take over.
  if (initialOwner?.id !== currentUser?.id) {
    return (
      <PostLockDialog
        isOpen={Boolean(currentOwner?.id)}
        owner={currentOwner}
        onClose={closeDialog}
        previewLink={previewLink}
        dashboardLink={dashboardLink}
      />
    );
  }

  // Second time around, show message that story was taken over.
  if (
    currentUser?.id === initialOwner?.id &&
    currentOwner?.id !== currentUser?.id
  ) {
    return (
      <PostTakeOverDialog
        isOpen={Boolean(currentOwner?.id)}
        owner={currentOwner}
        dashboardLink={dashboardLink}
        previewLink={previewLink}
        onClose={closeDialog}
      />
    );
  }

  return null;
}

export default PostLock;
