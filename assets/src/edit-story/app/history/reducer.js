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
export const ADD_ENTRY = 'add';
export const CLEAR_HISTORY = 'clear';
export const CLEAR_REPLAY_STATE = 'clear_replay';
export const REPLAY = 'replay';

export const EMPTY_STATE = {
  entries: [],
  offset: 0,
  replayState: null,
  versionNumber: 0,
};

const reducer = (size) => (state, { type, payload }) => {
  const currentEntry = state.entries[state.offset];
  const replayState = state.entries[payload];
  switch (type) {
    case ADD_ENTRY:
      // If not, trim `entries` from `offset` (basically destroy all undone states),
      // add new entry but limit entire storage to `size`
      // and clear `offset` and `replayState`.
      return {
        entries: [payload, ...state.entries.slice(state.offset)].slice(0, size),
        versionNumber: state.versionNumber + 1,
        offset: 0,
        replayState: null,
      };

    case CLEAR_REPLAY_STATE:
      // Clears the replayState which indicates that state change was caused by applying replay.
      if (state.replayState) {
        return {
          ...state,
          replayState: null,
        };
      }
      return state;
    case REPLAY:
      // If a page has changed and it was not an added page, and if the page is about to change with replay,
      // Ensure the user stays on the page where the latest change happened.
      if (
        currentEntry &&
        currentEntry.pages !== replayState.pages &&
        currentEntry.pages.length === replayState.pages.length &&
        currentEntry.current !== replayState.current
      ) {
        const changedPage = currentEntry.pages.filter((page, index) => {
          return page !== replayState.pages[index];
        });
        // If a changed page was found.
        if (changedPage.length === 1) {
          // Ensure we stay on the changed page by overriding the previously saved current page.
          const current = changedPage[0].id;
          const replay = { ...replayState, current };
          return {
            ...state,
            offset: payload,
            replayState: replay,
          };
        }
      }
      return {
        ...state,
        offset: payload,
        replayState,
      };

    case CLEAR_HISTORY:
      return {
        ...EMPTY_STATE,
      };

    default:
      throw new Error(`Unknown history reducer action: ${type}`);
  }
};

export default reducer;
