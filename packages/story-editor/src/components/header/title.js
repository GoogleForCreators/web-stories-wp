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
import styled, { css } from 'styled-components';
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { useConfig } from '../../app/config';
import { updateSlug } from '../../utils/storyUpdates';
import { styles, states, useHighlights } from '../../app/highlights';

const Input = styled.input`
  color: ${({ theme }) => `${theme.colors.fg.primary} !important`};
  margin: 0;
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { MEDIUM }) => paragraph[MEDIUM]
  )}
  background: ${({ isHighlighted }) => !isHighlighted && 'none !important'};
  border: none !important;
  text-align: start;
  min-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: ${({ theme }) => theme.borders.radius.small};

  ${themeHelpers.focusableOutlineCSS};

  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      ${styles.OUTLINE}
      ${styles.FLASH}
    `}
`;

function HeaderTitle() {
  const { title, slug, updateStory } = useStory(
    ({
      state: {
        story: { title, slug },
      },
      actions: { updateStory },
    }) => ({ title, slug, updateStory })
  );

  const { highlight, resetHighlight, cancelHighlight } = useHighlights(
    (state) => ({
      highlight: state[states.STORY_TITLE],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    })
  );

  const { storyId } = useConfig();

  const handleChange = useCallback(
    (evt) => updateStory({ properties: { title: evt.target.value } }),
    [updateStory]
  );

  const handleBlur = useCallback(() => {
    updateSlug({
      currentSlug: slug,
      currentTitle: title,
      storyId,
      updateStory,
    });
  }, [slug, storyId, title, updateStory]);

  if (typeof title !== 'string') {
    return null;
  }

  return (
    <Input
      ref={(node) => {
        if (node && highlight?.focus && highlight?.showEffect) {
          node.addEventListener('keydown', cancelHighlight, { once: true });
          node.focus();
        }
      }}
      value={title}
      type="text"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={__('Add title', 'web-stories')}
      aria-label={__('Story title', 'web-stories')}
      isHighlighted={highlight?.showEffect}
      onAnimationEnd={() => resetHighlight()}
    />
  );
}

export default HeaderTitle;
