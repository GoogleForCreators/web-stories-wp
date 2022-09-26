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
import PropTypes from 'prop-types';
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import GeneralPageAdvancementPanel from '../../shared/generalPageAdvancement';

function PageAdvancementPanel({ nameOverride }) {
  const { autoAdvance, defaultPageDuration, updateStory } = useStory(
    ({
      state: {
        story: { autoAdvance, defaultPageDuration },
      },
      actions: { updateStory },
    }) => ({ autoAdvance, defaultPageDuration, updateStory })
  );

  const onUpdate = useCallback(
    (newProps) => {
      // Rename "pageDuration" property to "defaultPageDuration"
      const { pageDuration, ...rest } = newProps;
      const properties = { ...rest, defaultPageDuration: pageDuration };
      updateStory({ properties });
    },
    [updateStory]
  );

  return (
    <GeneralPageAdvancementPanel
      panelName={nameOverride || 'pageAdvancement'}
      collapsedByDefault={false}
      onUpdate={onUpdate}
      autoAdvance={autoAdvance}
      pageDuration={defaultPageDuration}
    >
      {__(
        'Control whether a story auto-advances between pages, or whether the reader has to manually tap to advance.',
        'web-stories'
      )}
    </GeneralPageAdvancementPanel>
  );
}

export default PageAdvancementPanel;

PageAdvancementPanel.propTypes = {
  nameOverride: PropTypes.string,
};
