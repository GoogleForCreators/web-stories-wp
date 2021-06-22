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
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { states, useHighlights } from '../../../app/highlights';
import { PRIORITY_COPY } from '../../../app/prepublish/newConstants';
import { List, THEME_CONSTANTS } from '../../../../design-system';
import {
  ChecklistCard,
  CardListWrapper,
  FooterText,
  DefaultCtaButton,
  LearnMoreLink,
} from '../../checklistCard';
import { hasNoFeaturedMedia } from '../utils';

export function storyHasNoPosterAttached(story) {
  return (
    typeof story.featuredMedia?.url !== 'string' || hasNoFeaturedMedia(story)
  );
}

export function StoryPosterAttached() {
  //@TODO refine this context selector and storyHasNoPosterAttached to run more selectively
  const story = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  return storyHasNoPosterAttached(story) ? (
    <ChecklistCard
      title={PRIORITY_COPY.storyMissingPoster.title}
      footer={
        <FooterText>
          <CardListWrapper>
            <List size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
              {PRIORITY_COPY.storyMissingPoster.footer}
            </List>
            <LearnMoreLink />
          </CardListWrapper>
        </FooterText>
      }
      cta={
        <DefaultCtaButton
          onClick={() =>
            setHighlights({
              highlight: states.POSTER,
            })
          }
        >
          {__('Upload', 'web-stories')}
        </DefaultCtaButton>
      }
    />
  ) : null;
}
