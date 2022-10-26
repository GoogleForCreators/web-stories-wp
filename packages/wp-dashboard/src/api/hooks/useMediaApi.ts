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
import { useCallback, useReducer } from '@googleforcreators/react';
import { useConfig } from '@googleforcreators/dashboard';

/**
 * Internal dependencies
 */
import mediaReducer, { defaultMediaState, ActionType } from '../reducers/media';
import { ERRORS } from '../../constants';
import { uploadMedia as uploadMediaCallback } from '../media';

export default function useMediaApi() {
  const [state, dispatch] = useReducer(mediaReducer, defaultMediaState);
  const {
    api: { media: mediaApiPath },
  } = useConfig();

  const uploadMedia = useCallback(
    async (files: File[]) => {
      dispatch({
        type: ActionType.LoadingMedia,
      });

      try {
        // each file needs to be uploaded separately
        const mediaResponse = await uploadMediaCallback(mediaApiPath, files);

        dispatch({
          type: ActionType.AddMediaSuccess,
          payload: {
            newlyCreatedMediaIds: mediaResponse.map(({ id }) => id),
          },
        });
      } catch (err) {
        dispatch({
          type: ActionType.AddMediaFailure,
          payload: {
            message:
              ERRORS.UPLOAD_PUBLISHER_LOGO[
                files.length > 1 ? 'MESSAGE_PLURAL' : 'MESSAGE'
              ],
          },
        });
      }
    },
    [mediaApiPath]
  );

  return {
    media: state,
    api: {
      uploadMedia,
    },
  };
}
