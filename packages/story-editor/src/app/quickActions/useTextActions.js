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
import { useMemo } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useApplyTextAutoStyle from '../../utils/useApplyTextAutoStyle';
import { ACTIONS } from './constants';

function useTextActions({
  selectedElement,
  updater,
  commonActions,
  actionProps,
}) {
  const applyTextAutoStyle = useApplyTextAutoStyle(
    selectedElement,
    (properties) =>
      updater({
        elementIds: [selectedElement?.id],
        properties,
      })
  );
  const textActions = useMemo(
    () => [
      {
        Icon: Icons.ColorBucket,
        label: ACTIONS.AUTO_STYLE_TEXT.text,
        onClick: () => {
          applyTextAutoStyle();
          trackEvent('quick_action', {
            name: ACTIONS.AUTO_STYLE_TEXT.trackingEventName,
            element: 'text',
          });
        },
        ...actionProps,
      },
      ...commonActions,
    ],
    [applyTextAutoStyle]
  );
  return textActions;
}

export default useTextActions;
