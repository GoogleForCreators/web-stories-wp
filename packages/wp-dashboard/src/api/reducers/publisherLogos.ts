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
 * Internal dependencies
 */
import type { PublisherLogo, PublisherLogoId } from '../../types';

export enum ActionType {
  Loading = 'loading',
  UpdateFailure = 'update_failure',
  UpdateSuccess = 'update_success',
  FetchFailure = 'fetch_failure',
  FetchSuccess = 'fetch_success',
  RemoveSuccess = 'remove_success',
  AddFailure = 'add_failure',
  AddSuccess = 'add_success',
}

export interface PublisherLogosState {
  error: {
    id?: number | string;
    message?: string;
  };
  isLoading: boolean;
  publisherLogos: PublisherLogo[];
  settingSaved: boolean;
}

interface PublisherLogosBaseAction {
  type: ActionType;
}

interface LoadingAction extends PublisherLogosBaseAction {
  type: ActionType.Loading;
}

interface FailureAction extends PublisherLogosBaseAction {
  type:
    | ActionType.FetchFailure
    | ActionType.UpdateFailure
    | ActionType.AddFailure;
  payload: {
    message: string;
    [key: string]: unknown;
  };
}

interface AddSuccessAction extends PublisherLogosBaseAction {
  type: ActionType.AddSuccess;
  payload: {
    publisherLogo: PublisherLogo;
  };
}

interface FetchSuccessAction extends PublisherLogosBaseAction {
  type: ActionType.FetchSuccess;
  payload: {
    publisherLogos: PublisherLogo[];
  };
}

interface UpdateSuccessAction extends PublisherLogosBaseAction {
  type: ActionType.UpdateSuccess;
  payload: {
    publisherLogo: PublisherLogo;
  };
}
interface RemoveSuccessAction extends PublisherLogosBaseAction {
  type: ActionType.RemoveSuccess;
  payload: {
    id: PublisherLogoId;
  };
}

type PublisherLogosAction =
  | LoadingAction
  | FailureAction
  | AddSuccessAction
  | FetchSuccessAction
  | UpdateSuccessAction
  | RemoveSuccessAction;

export const defaultPublisherLogosState: PublisherLogosState = {
  error: {},
  isLoading: false,
  publisherLogos: [],
  settingSaved: false,
};

function publisherLogoReducer(
  state: PublisherLogosState,
  action: PublisherLogosAction
): PublisherLogosState {
  switch (action.type) {
    case ActionType.Loading: {
      return {
        ...state,
        isLoading: true,
        settingSaved: false,
      };
    }

    case ActionType.AddFailure:
    case ActionType.UpdateFailure:
    case ActionType.FetchFailure: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
        isLoading: false,
        settingSaved: false,
      };
    }

    case ActionType.FetchSuccess: {
      return {
        ...state,
        error: {},
        isLoading: false,
        publisherLogos: [...action.payload.publisherLogos],
      };
    }

    case ActionType.AddSuccess: {
      const newPublisherLogos = [
        ...state.publisherLogos,
        action.payload.publisherLogo,
      ];

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ActionType.UpdateSuccess: {
      const newPublisherLogos = [...state.publisherLogos].map(
        (publisherLogo) => {
          publisherLogo.active =
            publisherLogo.id === action.payload.publisherLogo.id;
          return publisherLogo;
        }
      );

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    case ActionType.RemoveSuccess: {
      const wasDefault = state.publisherLogos.some(
        ({ id, active }) => id === action.payload.id && active
      );

      const newPublisherLogos = [...state.publisherLogos]
        .filter(({ id }) => id !== action.payload.id)
        .map((publisherLogo, index) => {
          publisherLogo.active = wasDefault
            ? 0 === index
            : publisherLogo.active;
          return publisherLogo;
        });

      return {
        ...state,
        error: {},
        isLoading: false,
        settingSaved: true,
        publisherLogos: newPublisherLogos,
      };
    }

    default:
      return state;
  }
}

export default publisherLogoReducer;
