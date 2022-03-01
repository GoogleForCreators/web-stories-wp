/*
 * Copyright 2022 Google LLC
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
import { useCallback, useState } from '@googleforcreators/react';
import {
  Headline,
  TextArea,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../app';
import { updateSlug } from '../../../utils/storyUpdates';
import useInspector from '../../inspector/useInspector';
import { EXCERPT_MAX_LENGTH } from '../../panels/document/excerpt';
import { INPUT_KEYS } from '../constants';

const FormSection = styled.div`
  padding: 0 4px;
  &:first-of-type {
    margin: 20px 0px 0px;
  }
`;

const _TextArea = styled(TextArea)`
  margin: 8px 0 0;
  // We want 34px between each section on the main content panel. The TextArea's "hint" has a line height that forces the
  // space between sections to be too large, so this is to account for the extra space.
  & > p {
    margin-bottom: -4px;
  }
`;

const MainStoryInfo = () => {
  const storyId = useConfig(({ storyId }) => storyId);

  const updateStory = useStory(({ actions }) => actions.updateStory);
  const _inputValues = useStory(({ state: { story } }) => ({
    [INPUT_KEYS.EXCERPT]: story.excerpt,
    [INPUT_KEYS.TITLE]: story.title || '',
  }));
  // Keep slug isolated from other input values to limit changes and keep in sync on handleSlugUpdate
  const slug = useStory(
    ({
      state: {
        story: { slug },
      },
    }) => slug
  );

  const IsolatedStatusPanel = useInspector(
    ({ data }) => data?.modalInspectorTab?.IsolatedStatusPanel
  );

  const [inputValues, setInputValues] = useState(_inputValues);

  const handleUpdateSlug = useCallback(
    (newTitle) => {
      updateSlug({
        currentSlug: slug,
        currentTitle: newTitle,
        storyId,
        updateStory,
      });
    },
    [slug, updateStory, storyId]
  );

  const handleUpdateStoryInfo = useCallback(
    ({ target }) => {
      const { value, name } = target;
      updateStory({
        properties: { [name]: value },
      });

      if (name === INPUT_KEYS.TITLE) {
        handleUpdateSlug(value);
      }
    },
    [handleUpdateSlug, updateStory]
  );

  const onInputChange = ({ currentTarget }) => {
    setInputValues((prev) => ({
      ...prev,
      [currentTarget.name]: currentTarget.value,
    }));
  };
  return (
    <>
      <FormSection>
        <Headline
          as="label"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
          htmlFor={INPUT_KEYS.TITLE}
        >
          {__('Story Title', 'web-stories')}
        </Headline>
        <_TextArea
          name={INPUT_KEYS.TITLE}
          id="story-title"
          showCount
          value={inputValues[INPUT_KEYS.TITLE]}
          onChange={onInputChange}
          onBlur={handleUpdateStoryInfo}
          aria-label={__('Story Title', 'web-stories')}
          placeholder={__('Add title', 'web-stories')}
        />
      </FormSection>
      <FormSection>
        <Headline
          as="label"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
          htmlFor={INPUT_KEYS.EXCERPT}
        >
          {__('Story Description', 'web-stories')}
        </Headline>
        <_TextArea
          name={INPUT_KEYS.EXCERPT}
          id="story-excerpt"
          showCount
          maxLength={EXCERPT_MAX_LENGTH}
          value={inputValues[INPUT_KEYS.EXCERPT]}
          aria-label={__('Story Description', 'web-stories')}
          placeholder={__('Write a description of the story', 'web-stories')}
          hint={__(
            'Stories with a description tend to do better on search and have a wider reach',
            'web-stories'
          )}
          onChange={onInputChange}
          onBlur={handleUpdateStoryInfo}
        />
      </FormSection>
      {IsolatedStatusPanel && <IsolatedStatusPanel />}
    </>
  );
};

export default MainStoryInfo;
