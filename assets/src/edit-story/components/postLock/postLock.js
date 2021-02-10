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
import { useEffect, useCallback, useState } from 'react';
/**
 * Internal dependencies
 */
import { useAPI } from '../../app';
import Modal from '../modal';

function PostLock() {
  const {
    actions: { getPostLock },
  } = useAPI();

  const [showDialog, setShowDialog] = useState(false);
  const [lockData, setLockData] = useState({
    text: '',
    avatar_src: '',
    avatar_src_2x: '',
  });

  useEffect(() => {
    // @todo get lock status from localized data.
    const storyId = 266; // @todo get current storyId.
    getPostLock(storyId).then((data) => {

      if (data['wp-refresh-post-lock'].lock_error) {
        // Post is locked by another user.
        setShowDialog(true);
        setLockData(data['wp-refresh-post-lock'].lock_error);
      }
    });
  }, [getPostLock]);

  return (
    <Modal open={showDialog} onClose={() => true}>
      <p>{lockData.text}</p>
    </Modal>
  );
}
export default PostLock;
