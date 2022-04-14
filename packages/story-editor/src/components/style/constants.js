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
import { __ } from '@googleforcreators/i18n';
import { STYLE_PANE_IDS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import SelectionIcon from './selectionIcon';
import LinkIcon from './linkIcon';
import AnimationIcon from './animationIcon';

export const SELECTION = {
  id: STYLE_PANE_IDS.SELECTION,
  icon: SelectionIcon,
  tooltip: __('Selection', 'web-stories'),
};
export const LINK = {
  id: STYLE_PANE_IDS.LINK,
  icon: LinkIcon,
  tooltip: __('Link', 'web-stories'),
};
export const ANIMATION = {
  id: STYLE_PANE_IDS.ANIMATION,
  icon: AnimationIcon,
  tooltip: __('Animation', 'web-stories'),
};
