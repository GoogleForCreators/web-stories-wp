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
import { trackError } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useAPI } from '../../app';
import { getContent } from './utils';
import StatusCheckFailed from './statusCheckFailed';

function StatusCheck() {
  const {
    actions: { getStatusCheck },
  } = useAPI();
  const [showDialog, setShowDialog] = useState(false);
  const closeDialog = useCallback(() => setShowDialog(false), []);

  useEffect(() => {
    // If it succeeds, do nothing.
    // Only in case of failure do we want to alert the user and track the error.
    getStatusCheck(getContent()).catch((err) => {
      setShowDialog(true);
      trackError('status_check', err.message);
    });
  }, [getStatusCheck]);

  return <StatusCheckFailed isOpen={showDialog} onClose={closeDialog} />;
}
export default StatusCheck;
