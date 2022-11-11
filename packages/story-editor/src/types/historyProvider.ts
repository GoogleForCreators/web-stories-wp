/*
 * Copyright 2022 Google LLC
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
import type { Page, Story } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type {
  CLEAR_HISTORY,
  REPLAY,
  SET_CURRENT_STATE,
} from '../app/history/reducer';

export interface HistoryEntry {
  story: Story;
  selection: string[];
  current: string | null;
  pages: Page[];
  capabilities: Record<string, boolean>;
}

interface SetCurrentStateProps {
  type: typeof SET_CURRENT_STATE;
  payload: HistoryEntry;
}

interface ClearHistoryProps {
  type: typeof CLEAR_HISTORY;
  payload?: null;
}

interface ReplayProps {
  type: typeof REPLAY;
  payload: number;
}
export type ReducerProps =
  | SetCurrentStateProps
  | ClearHistoryProps
  | ReplayProps;

export interface ReducerState {
  entries: HistoryEntry[];
  offset: number;
  requestedState: null | HistoryEntry;
  versionNumber: number;
}

export interface Actions {
  stateToHistory: (state: HistoryEntry) => void;
  clearHistory: () => void;
  resetNewChanges: () => void;
  undo: (offset: number) => boolean;
  redo: (offset: number) => boolean;
}
export interface State {
  currentEntry: HistoryEntry;
  hasNewChanges: boolean;
  requestedState: HistoryEntry | null;
  canUndo: boolean;
  canRedo: boolean;
  versionNumber: number;
}
export interface HistoryState {
  state: State;
  actions: Actions;
}
