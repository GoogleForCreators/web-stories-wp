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
 * Internal dependencies
 */
import type { Tip } from '../../types/configProvider';

export interface HelpCenterState {
  isOpen: boolean;
  isOpeningToTip: boolean;
  navigationIndex: number;
  navigationFlow: string[];
  isLeftToRightTransition: boolean;
  hasBottomNavigation: boolean;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  readTips: Record<string, boolean>;
  readError: boolean;
  unreadTipsCount: number;
  isHydrated: boolean;
  tips: Record<string, Tip>;
  tipKeys: string[];
}

export type HelpCenterActionArgument =
  | Pick<HelpCenterState, 'readTips'>
  | string
  | undefined;

export interface HelpCenterActions<T> {
  goToNext: () => T;
  goToPrev: () => T;
  goToMenu: () => T;
  goToTip: (key: string) => T;
  openToUnreadTip: (key: string) => T;
  toggle: () => T;
  close: () => T;
  hydrateReadTipsSuccess: (payload: Pick<HelpCenterState, 'readTips'>) => T;
  persistingReadTipsError: () => T;
}

export interface HelpCenterContext {
  state: HelpCenterState;
  actions: HelpCenterActions<void>;
}

export interface HelpCenterReducerContext {
  state: HelpCenterState;
  actions: HelpCenterActions<
    (previous: HelpCenterState) => Partial<HelpCenterState>
  >;
}
