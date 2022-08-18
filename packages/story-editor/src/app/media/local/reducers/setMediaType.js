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
 * Internal dependencies
 */
import { LOCAL_MEDIA_TYPE_ALL } from '../types';

function setMediaType(state, { mediaType }) {
  if (mediaType === state.mediaType) {
    return state;
  }

  // Filters existing media in the state by mediaType
  // for immediate user feedback while the provider fetches items from the server.
  // Useful when switching e.g. from All -> Videos, since there might
  // be some videos already in state.
  return {
    ...state,
    // media: [],
    media:
      mediaType === LOCAL_MEDIA_TYPE_ALL
        ? []
        : state.media.filter(({ type }) => mediaType === type),
    pageToken: undefined,
    mediaType,
  };
}

export default setMediaType;
