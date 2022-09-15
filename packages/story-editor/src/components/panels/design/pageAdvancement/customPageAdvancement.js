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
 * External dependencies
 */
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import GeneralPageAdvancementPanel from '../../shared/generalPageAdvancement';

function CustomPageAdvancementPanel() {
  const {
    isOverridden,
    autoAdvance,
    pageDuration,
    updateCurrentPageProperties,
  } = useStory(
    ({
      state: {
        story: { autoAdvance: defaultAutoAdvance, defaultPageDuration },
        currentPage: { advancement },
      },
      actions: { updateCurrentPageProperties },
    }) => ({
      isOverridden: typeof advancement === 'object',
      autoAdvance: advancement?.autoAdvance ?? defaultAutoAdvance,
      pageDuration: advancement?.pageDuration ?? defaultPageDuration,
      updateCurrentPageProperties,
    })
  );

  const onUpdate = useCallback(
    (properties) => {
      if (properties.override === false) {
        updateCurrentPageProperties({ properties: { advancement: undefined } });
      } else {
        const { override, ...rest } = properties;
        const advancement = {
          autoAdvance,
          pageDuration,
          ...rest,
        };
        updateCurrentPageProperties({ properties: { advancement } });
      }
    },
    [autoAdvance, pageDuration, updateCurrentPageProperties]
  );

  return (
    <GeneralPageAdvancementPanel
      panelName={'customPageAdvancement'}
      onUpdate={onUpdate}
      autoAdvance={autoAdvance}
      pageDuration={pageDuration}
      hasOverrideEnabled={isOverridden}
      allowsOverride
      collapsedByDefault
    >
      {__(
        'Control whether this page auto-advances to the next page, or whether the reader has to manually tap to advance.',
        'web-stories'
      )}
    </GeneralPageAdvancementPanel>
  );
}

export default CustomPageAdvancementPanel;
