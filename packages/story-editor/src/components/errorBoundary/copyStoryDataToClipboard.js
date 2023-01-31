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
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '@googleforcreators/design-system';
import { useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';

function CopyStoryDataToClipboard() {
  const { pages, current, selection, story } = useStory(({ internal }) => ({
    pages: internal.reducerState.pages,
    current: internal.reducerState.current,
    selection: internal.reducerState.selection,
    story: internal.reducerState.story,
  }));

  const copyToClipboard = useCallback(async () => {
    const jsonStr = JSON.stringify(
      { pages, current, selection, story },
      null,
      2
    );
    try {
      await navigator.clipboard.writeText(jsonStr);
      alert(__('Copied to clipboard', 'web-stories'));
    } catch (err) {
      alert(__('Failed to copy story data', 'web-stories'));
    }
  }, [pages, current, selection, story]);

  if (!pages || !current || !selection || !story) {
    return null;
  }

  return (
    <Button
      onClick={copyToClipboard}
      variant={ButtonVariant.Rectangle}
      type={ButtonType.Quaternary}
      size={ButtonSize.Small}
    >
      {__('Copy story data', 'web-stories')}
    </Button>
  );
}

export default CopyStoryDataToClipboard;
