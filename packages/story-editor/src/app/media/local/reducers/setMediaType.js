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
import { INITIAL_STATE } from '../constants';

function setMediaType(state, { mediaType }) {
  if (mediaType === state.mediaType) {
    return state;
  }
  return {
    ...INITIAL_STATE,
    media: state.media.filter(({ local }) => local), // This filter allows remove temporary file returned on upload
    audioProcessing: [...state.audioProcessing],
    audioProcessed: [...state.audioProcessed],
    posterProcessing: [...state.posterProcessing],
    posterProcessed: [...state.posterProcessed],
    searchTerm: state.searchTerm,
    mediaType,
  };
}

export default setMediaType;
