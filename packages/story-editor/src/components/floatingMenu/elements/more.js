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
import { _x } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { states, useHighlights } from '../../../app/highlights';
import { TextButton } from './shared';

function More() {
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const selectedElementType = useStory(
    ({ state }) => state.selectedElements[0].type
  );

  const handleHighlightDesignPanel = () => {
    setHighlights({
      highlight: states.STYLE_PANE,
    });

    trackEvent('floating_menu', {
      name: 'click_more_button',
      element: selectedElementType,
    });
  };

  return (
    <TextButton
      text={_x(
        'More',
        'Link to more options in design panel for selected element',
        'web-stories'
      )}
      onClick={handleHighlightDesignPanel}
    />
  );
}

export default More;
