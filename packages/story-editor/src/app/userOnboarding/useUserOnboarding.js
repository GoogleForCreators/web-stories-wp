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
import { useCallback, useDebouncedCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { KEYS } from '../../components/helpCenter/constants';
import { useHelpCenter } from '../helpCenter';
import { noop } from '../../utils/noop';

const TRIGGER_CONTEXTS = {
  SAFE_ZONE: 'safeZone',
};

export function useUserOnboarding(selector) {
  const triggerType = selector(TRIGGER_CONTEXTS);

  const { openToUnreadTip = noop } = useHelpCenter(({ actions }) => ({
    openToUnreadTip: actions.openToUnreadTip,
  }));

  const openToUnreadTipDebounced = useDebouncedCallback(openToUnreadTip, 300);

  const trigger = useCallback(() => {
    switch (triggerType) {
      case TRIGGER_CONTEXTS.SAFE_ZONE:
        openToUnreadTipDebounced(KEYS.SAFE_ZONE);
        break;
      default:
        return;
    }
  }, [triggerType, openToUnreadTipDebounced]);

  return trigger;
}
