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
import styled from 'styled-components';
import { useCallback, useRef, useEffect, useState } from 'react';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { useConfig } from '../../app/config';
import { useUnits } from '../../units';
import cleanForSlug from '../../utils/cleanForSlug';

const Wrapper = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
`;

const INPUT_MIN_WIDTH = 94;

const Input = styled.input`
  color: ${({ theme }) => `${theme.colors.fg.white} !important`};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.storyTitle.family};
  font-size: ${({ theme }) => theme.fonts.storyTitle.size};
  line-height: ${({ theme }) => theme.fonts.storyTitle.lineHeight};
  background: none !important;
  text-overflow: ellipsis;
  text-align: ${({ isCentered }) => (isCentered ? 'center' : 'start')};
  margin-left: ${({ leftMargin }) => (leftMargin ? `${leftMargin}px` : '0')};
  width: ${({ isFullWidth }) =>
    isFullWidth ? '100%' : `${INPUT_MIN_WIDTH}px`};
  border: 1px solid transparent !important;

  &:hover,
  &:focus {
    border-color: ${({ theme }) => rgba(theme.colors.fg.white, 0.3)} !important;
    box-shadow: none !important;
  }
`;

function Title() {
  const { title, slug, updateStory } = useStory(
    ({
      state: {
        story: { title, slug },
      },
      actions: { updateStory },
    }) => ({ title, slug, updateStory })
  );
  const {
    state: {
      pageSize: { width },
    },
  } = useUnits();
  const minCenteredWidth = (width + INPUT_MIN_WIDTH) / 2;
  const leftMargin = (width - INPUT_MIN_WIDTH) / 2;

  const [isCentered, setIsCentered] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(true);
  const ref = useRef();

  useEffect(
    () => {
      if (!ref.current) {
        return undefined;
      }

      const update = (entries) => {
        Array.from(entries).forEach((entry) => {
          const actualWidth = entry.borderBoxSize[0].inlineSize;
          setIsFullWidth(actualWidth >= width);
          setIsCentered(actualWidth >= minCenteredWidth);
        });
      };
      const rs = new ResizeObserver(update);
      rs.observe(ref.current);
      return () => rs.disconnect();
    },
    // We need `title` here to attach RS when input exists
    [title, minCenteredWidth, width]
  );

  const { storyId } = useConfig();

  const handleChange = useCallback(
    (evt) => updateStory({ properties: { title: evt.target.value } }),
    [updateStory]
  );

  const handleBlur = useCallback(() => {
    if (!slug || slug === storyId) {
      const cleanSlug = encodeURIComponent(cleanForSlug(title)) || storyId;
      updateStory({ properties: { slug: cleanSlug } });
    }
  }, [slug, storyId, title, updateStory]);

  if (typeof title !== 'string') {
    return null;
  }

  return (
    <Wrapper ref={ref} maxWidth={width}>
      <Input
        leftMargin={!isFullWidth && isCentered ? leftMargin : 0}
        isFullWidth={isFullWidth}
        isCentered={isCentered}
        value={title}
        type={'text'}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={__('Add title', 'web-stories')}
        aria-label={__('Edit: Story title', 'web-stories')}
      />
    </Wrapper>
  );
}

export default Title;
