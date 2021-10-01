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

/**
 * Internal dependencies
 */
import publisherLogosReducer, {
  defaultPublisherLogosState,
  ACTION_TYPES,
} from '../reducer/publisherLogos';
import { ERRORS } from '../textContent';
import { useConfig } from '../config';

export default function usePublisherLogosApi(globalPublisherLogosApi) {
  const [state, dispatch] = useReducer(
    publisherLogosReducer,
    defaultPublisherLogosState
  );
  const {
    apiCallbacks: {
      fetchPublisherLogos: fetchPublisherLogosCallback,
      addPublisherLogo: addPublisherLogoCallback,
      removePublisherLogo: removePublisherLogoCallback,
      setPublisherLogoAsDefault: setPublisherLogoAsDefaultCallback,
    },
  } = useConfig();

  const fetchPublisherLogos = useCallback(async () => {
    dispatch({
      type: ACTION_TYPES.LOADING,
    });

    try {
      const response = await fetchPublisherLogosCallback(
        globalPublisherLogosApi
      );

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
  }, [fetchPublisherLogosCallback, globalPublisherLogosApi]);

  const removePublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        await removePublisherLogoCallback(
          publisherLogoId,
          globalPublisherLogosApi
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
    [removePublisherLogoCallback, globalPublisherLogosApi]
  );

  const addPublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await addPublisherLogoCallback(
          publisherLogoId,
          globalPublisherLogosApi
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
    [addPublisherLogoCallback, globalPublisherLogosApi]
  );

  const setPublisherLogoAsDefault = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await setPublisherLogoAsDefaultCallback(
          publisherLogoId,
          globalPublisherLogosApi
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
    [setPublisherLogoAsDefaultCallback, globalPublisherLogosApi]
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
