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
import { useCallback, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Row, TextArea } from '../../../form';
import { SimplePanel } from '../../panel';
import Note from '../../shared/note';
import { useFocusHighlight, states, styles } from '../../../../app/highlights';

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

  const ref = useRef();
  const highlight = useFocusHighlight(states.EXCERPT, ref);

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      name="excerpt"
      title={__('Story Description', 'web-stories')}
      collapsedByDefault={false}
      isPersistable={!highlight}
    >
      <Row>
        <TextArea
          ref={ref}
          value={excerpt}
          onTextChange={handleTextChange}
          placeholder={__('Write a description of the story', 'web-stories')}
          aria-label={__('Story Description', 'web-stories')}
          maxLength={EXCERPT_MAX_LENGTH}
          rows={4}
          css={highlight?.showEffect && styles.OUTLINE}
        />
      </Row>
      <Row>
        <Note>
          {__(
            'Stories with a description tend to do better on search and have a wider reach.',
            'web-stories'
          )}
        </Note>
      </Row>
    </SimplePanel>
  );
}

export default ExcerptPanel;
