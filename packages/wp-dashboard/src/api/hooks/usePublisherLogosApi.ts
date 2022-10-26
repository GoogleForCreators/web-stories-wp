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
import publisherLogosReducer, {
  defaultPublisherLogosState,
  ActionType,
} from '../reducers/publisherLogos';
import { ERRORS } from '../../constants';
import {
  fetchPublisherLogos as fetchPublisherLogosCallback,
  addPublisherLogo as addPublisherLogoCallback,
  removePublisherLogo as removePublisherLogoCallback,
  setPublisherLogoAsDefault as setPublisherLogoAsDefaultCallback,
} from '../publisherLogo';
import type { PublisherLogoId } from '../../types';

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
      type: ActionType.Loading,
    });

    try {
      const response = await fetchPublisherLogosCallback(publisherLogosApiPath);

      if (!Array.isArray(response)) {
        dispatch({
          type: ActionType.FetchFailure,
          payload: {
            message: ERRORS.LOAD_PUBLISHER_LOGOS.MESSAGE,
          },
        });
      } else {
        dispatch({
          type: ActionType.FetchSuccess,
          payload: {
            publisherLogos: response,
          },
        });
      }
    } catch (err) {
      dispatch({
        type: ActionType.FetchFailure,
        payload: {
          message: ERRORS.LOAD_PUBLISHER_LOGOS.MESSAGE,
        },
      });
    }
  }, [publisherLogosApiPath]);

  const removePublisherLogo = useCallback(
    async (publisherLogoId: PublisherLogoId) => {
      dispatch({
        type: ActionType.Loading,
      });

      try {
        await removePublisherLogoCallback(
          publisherLogosApiPath,
          publisherLogoId
        );

        dispatch({
          type: ActionType.RemoveSuccess,
          payload: {
            id: publisherLogoId,
          },
        });
      } catch (err) {
        dispatch({
          type: ActionType.FetchFailure,
          payload: {
            message: ERRORS.REMOVE_PUBLISHER_LOGO.MESSAGE,
          },
        });
      }
    },
    [publisherLogosApiPath]
  );

  const addPublisherLogo = useCallback(
    async (publisherLogoIds: PublisherLogoId) => {
      dispatch({
        type: ActionType.Loading,
      });

      try {
        const response = await addPublisherLogoCallback(
          publisherLogosApiPath,
          publisherLogoIds
        );

        const publisherLogos = Array.isArray(response) ? response : [response];

        for (const publisherLogo of publisherLogos) {
          dispatch({
            type: ActionType.AddSuccess,
            payload: {
              publisherLogo,
            },
          });
        }
      } catch (err) {
        dispatch({
          type: ActionType.AddFailure,
          payload: {
            message: ERRORS.UPLOAD_PUBLISHER_LOGO.MESSAGE,
          },
        });
      }
    },
    [publisherLogosApiPath]
  );

  const setPublisherLogoAsDefault = useCallback(
    async (publisherLogoId: PublisherLogoId) => {
      dispatch({
        type: ActionType.Loading,
      });

      try {
        const response = await setPublisherLogoAsDefaultCallback(
          publisherLogosApiPath,
          publisherLogoId
        );

        dispatch({
          type: ActionType.UpdateSuccess,
          payload: {
            publisherLogo: response,
          },
        });
      } catch (err) {
        dispatch({
          type: ActionType.FetchFailure,
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
