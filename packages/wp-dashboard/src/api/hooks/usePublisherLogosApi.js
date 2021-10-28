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
import { useCallback, useReducer } from '@web-stories-wp/react';
import { useConfig } from '@web-stories-wp/dashboard';

/**
 * Internal dependencies
 */
import publisherLogosReducer, {
  defaultPublisherLogosState,
  ACTION_TYPES,
} from '../reducers/publisherLogos';
import { ERRORS } from '../../constants';

import {
  fetchPublisherLogos as fetchPublisherLogosCallback,
  addPublisherLogo as addPublisherLogoCallback,
  removePublisherLogo as removePublisherLogoCallback,
  setPublisherLogoAsDefault as setPublisherLogoAsDefaultCallback,
} from '../publisherLogo';

export default function usePublisherLogosApi() {
  const [state, dispatch] = useReducer(
    publisherLogosReducer,
    defaultPublisherLogosState
  );
  const {
    api: { publisherLogos: publisherLogosApiPath },
  } = useConfig();

  const fetchPublisherLogos = useCallback(async () => {
    dispatch({
      type: ACTION_TYPES.LOADING,
    });

    try {
      const response = await fetchPublisherLogosCallback(publisherLogosApiPath);

      if (!Array.isArray(response)) {
        dispatch({
          type: ACTION_TYPES.FETCH_FAILURE,
          payload: {
            message: ERRORS.LOAD_PUBLISHER_LOGOS.MESSAGE,
          },
        });
      } else {
        dispatch({
          type: ACTION_TYPES.FETCH_SUCCESS,
          payload: {
            publisherLogos: response,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.FETCH_FAILURE,
        payload: {
          message: ERRORS.LOAD_PUBLISHER_LOGOS.MESSAGE,
        },
      });
    }
  }, [publisherLogosApiPath]);

  const removePublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        await removePublisherLogoCallback(
          publisherLogosApiPath,
          publisherLogoId
        );

        dispatch({
          type: ACTION_TYPES.REMOVE_SUCCESS,
          payload: {
            id: publisherLogoId,
          },
        });
      } catch (err) {
        dispatch({
          type: ACTION_TYPES.FETCH_FAILURE,
          payload: {
            message: ERRORS.REMOVE_PUBLISHER_LOGO.MESSAGE,
          },
        });
      }
    },
    [publisherLogosApiPath]
  );

  const addPublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await addPublisherLogoCallback(
          publisherLogosApiPath,
          publisherLogoId
        );

        dispatch({
          type: ACTION_TYPES.ADD_SUCCESS,
          payload: {
            publisherLogo: response,
          },
        });
      } catch (err) {
        dispatch({
          type: ACTION_TYPES.ADD_FAILURE,
          payload: {
            message: ERRORS.UPLOAD_PUBLISHER_LOGO.MESSAGE,
          },
        });
      }
    },
    [publisherLogosApiPath]
  );

  const setPublisherLogoAsDefault = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await setPublisherLogoAsDefaultCallback(
          publisherLogosApiPath,
          publisherLogoId
        );

        dispatch({
          type: ACTION_TYPES.UPDATE_SUCCESS,
          payload: {
            publisherLogo: response,
          },
        });
      } catch (err) {
        dispatch({
          type: ACTION_TYPES.FETCH_FAILURE,
          payload: {
            message: ERRORS.UPDATE_PUBLISHER_LOGO.MESSAGE,
          },
        });
      }
    },
    [publisherLogosApiPath]
  );

  return {
    publisherLogos: state,
    api: {
      fetchPublisherLogos,
      addPublisherLogo,
      removePublisherLogo,
      setPublisherLogoAsDefault,
    },
  };
}
