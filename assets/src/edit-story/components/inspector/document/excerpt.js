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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panels/panel';
import { Row, TextArea } from '../../form';
import { useStory } from '../../../app/story';
import Note from '../../panels/shared/note';

export const EXCERPT_MAX_LENGTH = 200;

function ExcerptPanel() {
  const { excerpt, updateStory } = useStory(
    ({
      state: {
        story: { excerpt = '' },
      },
      actions: { updateStory },
    }) => ({ excerpt, updateStory })
  );

  const handleTextChange = useCallback(
    (text) => {
      updateStory({
        properties: { excerpt: text },
      });
    },
    [updateStory]
  );

  return (
    <SimplePanel
      name="excerpt"
      title={__('Excerpt', 'web-stories')}
      collapsedByDefault={false}
    >
      <Row>
        <TextArea
          value={excerpt}
          onTextChange={handleTextChange}
          placeholder={__('Write an excerpt', 'web-stories')}
          aria-label={__('Edit: Story Excerpt', 'web-stories')}
          maxLength={EXCERPT_MAX_LENGTH}
          rows={4}
        />
      </Row>
      <Row>
        <Note>
          {__(
            'Stories with an excerpt tend to do better on search and have a wider reach.',
            'web-stories'
          )}
        </Note>
      </Row>
    </SimplePanel>
  );
}

export default ExcerptPanel;
