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

export enum ActionType {
  LoadingMedia = 'loading_media',
  AddMediaSuccess = 'add_media_success',
  AddMediaFailure = 'add_media_failure',
}

export interface MediaState {
  error: {
    id?: number | string;
    message?: string;
  };
  isLoading: boolean;
  newlyCreatedMediaIds: number[];
}

interface MediaBaseAction {
  type: ActionType;
}

interface LoadingMediaAction extends MediaBaseAction {
  type: ActionType.LoadingMedia;
}

interface AddMediaSuccessAction extends MediaBaseAction {
  type: ActionType.AddMediaSuccess;
  payload: {
    newlyCreatedMediaIds: number[];
  };
}
interface AddMediaFailureAction extends MediaBaseAction {
  type: ActionType.AddMediaFailure;
  payload: {
    message: string;
    [key: string]: unknown;
  };
}

type MediaAction =
  | LoadingMediaAction
  | AddMediaSuccessAction
  | AddMediaFailureAction;

export const defaultMediaState: MediaState = {
  error: {},
  isLoading: false,
  newlyCreatedMediaIds: [],
};

function mediaReducer(state: MediaState, action: MediaAction): MediaState {
  switch (action.type) {
    case ActionType.LoadingMedia: {
      return {
        ...state,
        isLoading: true,
        newlyCreatedMediaIds: [],
      };
    }

    case ActionType.AddMediaFailure: {
      return {
        ...state,
        error: { ...action.payload, id: Date.now() },
        isLoading: false,
      };
    }

    case ActionType.AddMediaSuccess: {
      return {
        ...state,
        error: {},
        isLoading: false,
        newlyCreatedMediaIds:
          action.payload.newlyCreatedMediaIds || state.newlyCreatedMediaIds,
      };
    }

    default:
      return state;
  }
}

export default mediaReducer;
