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
import { trackEvent } from '@googleforcreators/tracking';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useRichTextFormatting from '../../panels/design/textStyle/useRichTextFormatting';
import updateProperties from '../../inspector/design/updateProperties';
import { useStory } from '../../../app';
import { IconButton, useProperties } from './shared';

function ToggleBold() {
  const { content } = useProperties(['content']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const pushUpdate = useCallback(
    (update) => {
      trackEvent('floating_menu', {
        name: 'set_bold',
        element: 'text',
      });
      updateSelectedElements({
        properties: (element) => updateProperties(element, update, true),
      });
    },
    [updateSelectedElements]
  );
  const {
    textInfo: { isBold },
    handlers: { handleClickBold },
  } = useRichTextFormatting([{ content, type: 'text' }], pushUpdate);

  return (
    <IconButton
      isToggled={isBold}
      Icon={Icons.LetterBBold}
      title={__('Toggle bold', 'web-stories')}
      onClick={() => handleClickBold(!isBold)}
      tabIndex="0"
    />
  );
}

export default ToggleBold;
