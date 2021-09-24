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
import { useCallback, useMemo, useReducer } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import publisherLogosReducer, {
  defaultPublisherLogosState,
  ACTION_TYPES,
} from '../reducer/publisherLogos';

import { ERRORS } from '../textContent';

export default function usePublisherLogosApi(
  dataAdapter,
  { globalPublisherLogosApi }
) {
  const [state, dispatch] = useReducer(
    publisherLogosReducer,
    defaultPublisherLogosState
  );

  const fetchPublisherLogos = useCallback(async () => {
    dispatch({
      type: ACTION_TYPES.LOADING,
    });

    try {
      const response = await dataAdapter.get(globalPublisherLogosApi);

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
  }, [dataAdapter, globalPublisherLogosApi]);

  const removePublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        await dataAdapter.deleteRequest(
          `${globalPublisherLogosApi}${publisherLogoId}/`
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
    [dataAdapter, globalPublisherLogosApi]
  );

  const addPublisherLogo = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await dataAdapter.post(globalPublisherLogosApi, {
          data: {
            id: publisherLogoId,
          },
        });

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
    [dataAdapter, globalPublisherLogosApi]
  );

  const setPublisherLogoAsDefault = useCallback(
    async (publisherLogoId) => {
      dispatch({
        type: ACTION_TYPES.LOADING,
      });

      try {
        const response = await dataAdapter.post(
          `${globalPublisherLogosApi}${publisherLogoId}/`,
          {
            data: {
              active: true,
            },
          }
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
    [dataAdapter, globalPublisherLogosApi]
  );

  const api = useMemo(
    () => ({
      fetchPublisherLogos,
      addPublisherLogo,
      removePublisherLogo,
      setPublisherLogoAsDefault,
    }),
    [
      fetchPublisherLogos,
      addPublisherLogo,
      removePublisherLogo,
      setPublisherLogoAsDefault,
    ]
  );

  return { publisherLogos: state, api };
}
