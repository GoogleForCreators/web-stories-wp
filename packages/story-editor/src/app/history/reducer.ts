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
import type {
  HistoryReducerState,
  ReducerProps,
  HistoryEntry,
} from '../../types/historyProvider';

export enum ActionType {
  SetCurrentState = 'set_state',
  ClearHistory = 'clear',
  Replay = 'replay',
}

export const EMPTY_STATE = {
  entries: [],
  offset: 0,
  requestedState: null,
  versionNumber: 0,
};

const reducer =
  (size: number) =>
  (
    state: HistoryReducerState,
    { type, payload }: ReducerProps
  ): HistoryReducerState | never => {
    const currentEntry = state.entries[state.offset];
    switch (type) {
      case ActionType.SetCurrentState:
        // First check if everything in payload matches the current `requestedState`,
        // if so, update `offset` to match the state in entries and clear `requestedState`
        // and of course leave entries unchanged.
        if (state.requestedState) {
          const isReplay = Object.keys(state.requestedState).every(
            (key) =>
              // TS complains about this potentially being `null` despite of the check above.
              state.requestedState &&
              state.requestedState[key as keyof HistoryEntry] ===
                payload[key as keyof HistoryEntry]
          );

          if (isReplay) {
            const offset = state.entries.indexOf(state.requestedState);
            // If a page has changed and it was not an added page, and if the page is about to change with replay,
            // Ensure the user stays on the page where the latest change happened.
            if (
              currentEntry.pages !== state.requestedState.pages &&
              currentEntry.pages.length === state.requestedState.pages.length &&
              currentEntry.current !== state.requestedState.current
            ) {
              const changedPage = currentEntry.pages.filter((page, index) => {
                return (
                  state.requestedState &&
                  page !== state.requestedState.pages[index]
                );
              });
              // If a changed page was found.
              if (changedPage.length === 1) {
                // Ensure we stay on the changed page by overriding the previously saved current page.
                const current = changedPage[0].id;
                const requestedState = { ...state.requestedState, current };
                return {
                  ...state,
                  offset,
                  requestedState,
                };
              }
            }
            return {
              ...state,
              offset,
              requestedState: null,
            };
          }
        }

        // If not, trim `entries` from `offset` (basically destroy all undone states),
        // add new entry but limit entire storage to `size`
        // and clear `offset` and `requestedState`.
        return {
          entries: [payload, ...state.entries.slice(state.offset)].slice(
            0,
            size
          ),
          versionNumber: state.versionNumber + 1,
          offset: 0,
          requestedState: null,
        };

      case ActionType.Replay:
        return {
          ...state,
          versionNumber: state.versionNumber + (state.offset - payload),
          requestedState: state.entries[payload],
        };

      case ActionType.ClearHistory:
        return {
          ...EMPTY_STATE,
        };

      default:
        throw new Error(`Unknown history reducer action: ${type as string}`);
    }
  };

export default reducer;
