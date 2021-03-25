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
 * External dependencies
 */
import { useCallback } from 'react';
/**
 * Internal dependencies
 */
// import { useCurrentUser } from '../currentUser';
import { useHelpCenter } from '../helpCenter';

const TRIGGER_CONTEXTS = {
  SAFE_ZONE: 'safeZone',
  // todo [@embarks]: other onboarding triggers
};

export function useUserOnboarding(selector) {
  const triggerType = selector(TRIGGER_CONTEXTS);

  // const { updateCurrentUser, currentUser } = useCurrentUser(
  //   ({ state, actions }) => ({
  //     currentUser: state.currentUser,
  //     updateCurrentUser: actions.updateCurrentUser,
  //   })
  // );

  const { openToUnreadTip } = useHelpCenter(({ actions }) => ({
    openToUnreadTip: actions.openToUnreadTip,
  }));

  const trigger = useCallback(() => {
    switch (triggerType) {
      case TRIGGER_CONTEXTS.SAFE_ZONE:
        openToUnreadTip('safeZone');
        break;
      default:
        return;
    }
  }, [triggerType, openToUnreadTip]);

  return trigger;
}
