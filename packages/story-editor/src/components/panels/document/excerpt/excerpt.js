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
import styled from 'styled-components';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Row, TextArea } from '../../../form';
import { SimplePanel } from '../../panel';
import { useHighlights, states, styles } from '../../../../app/highlights';

// Margin -4px is making up for extra margin added by rows.
const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin-top: -4px;
`;

export const EXCERPT_MAX_LENGTH = 200;

function ExcerptPanel({ nameOverride }) {
  const { excerpt, updateStory } = useStory(
    ({
      state: {
        story: { excerpt = '' },
      },
      actions: { updateStory },
    }) => ({ excerpt, updateStory })
  );

  const handleTextChange = useCallback(
    (evt) => {
      updateStory({
        properties: { excerpt: evt.target.value },
      });
    },
    [updateStory]
  );

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.EXCERPT],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name={nameOverride || 'excerpt'}
      title={__('Story Description', 'web-stories')}
      collapsedByDefault={false}
      isPersistable={!highlight}
    >
      <Row>
        <TextArea
          ref={(node) => {
            if (node && highlight?.focus && highlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
            }
          }}
          value={excerpt}
          onChange={handleTextChange}
          placeholder={__('Write a description of the story', 'web-stories')}
          aria-label={__('Story Description', 'web-stories')}
          maxLength={EXCERPT_MAX_LENGTH}
          showCount
          rows={4}
          css={highlight?.showEffect && styles.OUTLINE}
        />
      </Row>
      <Row>
        <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
          {__(
            'Stories with a description tend to do better on search and have a wider reach',
            'web-stories'
          )}
        </StyledText>
      </Row>
    </SimplePanel>
  );
}

export default ExcerptPanel;

ExcerptPanel.propTypes = {
  nameOverride: PropTypes.string,
};
