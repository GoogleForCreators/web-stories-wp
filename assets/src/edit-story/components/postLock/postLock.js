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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFeatures } from 'flagged';
import { trackError } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app/api';
import { useStory } from '../../app/story';
import { useConfig } from '../../app/config';
import PostLockDialog from './postLockDialog';

function PostLock() {
  const {
    actions: { getStoryLockById, setStoryLockById, deleteStoryLockById },
  } = useAPI();
  const {
    storyId,
    userId,
    allStoriesLink,
    postLock: { interval: postLockInterval, enabled: postLockEnabled },
  } = useConfig();

  const { previewLink } = useStory(({ state: { story: { previewLink } } }) => ({
    previewLink,
  }));
  const [showDialog, setShowDialog] = useState(false);
  const [author, setAuthor] = useState({});
  const { enablePostLocking } = useFeatures();

  const closeDialog = useCallback(() => {
    setShowDialog(false);
    setStoryLockById(storyId);
  }, [setStoryLockById, storyId]);

  const doGetStoryLock = useCallback(() => {
    if (enablePostLocking && postLockEnabled) {
      getStoryLockById(storyId)
        .then((result) => {
          if (result.locked && result.user !== userId) {
            setShowDialog(true);
            setAuthor(result['_embedded'].author[0]);
          } else {
            setStoryLockById(storyId);
          }
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
    userId,
    enablePostLocking,
    postLockEnabled,
  ]);

  // Cache it to make it stable in terms of the below timeout
  const cachedDoGetStoryLock = useRef(doGetStoryLock);
  useEffect(() => {
    cachedDoGetStoryLock.current = doGetStoryLock;
  }, [doGetStoryLock]);


  useEffect(() => {
    async function releasePostLock() {
      if (enablePostLocking && postLockEnabled && !showDialog) {
        await deleteStoryLockById(storyId);
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
    postLockEnabled,
    showDialog,
  ]);

  useEffect(() => {
    cachedDoGetStoryLock.current();
    const timeout = setInterval(
      () => cachedDoGetStoryLock.current(),
      postLockInterval * 1000
    );

    return () => clearInterval(timeout);
  }, [postLockInterval]);

  return (
    <PostLockDialog
      open={showDialog}
      author={author}
      onClose={closeDialog}
      previewLink={previewLink}
      allStoriesLink={allStoriesLink}
    />
  );
}

export default PostLock;
