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
import { Icons } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { Input, useProperties } from './shared';

function LayerOpacity() {
  const { opacity } = useProperties(['opacity']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const handleOpacityChange = (_, value) =>
    updateSelectedElements({
      properties: () => ({
        opacity: value ?? 100,
      }),
    });

  return (
    <Input
      suffix={<Icons.ColorDrop />}
      value={opacity || 0}
      aria-label={__('Change layer opacity', 'web-stories')}
      onChange={handleOpacityChange}
      min={0}
      max={100}
    />
  );
}

export default LayerOpacity;
