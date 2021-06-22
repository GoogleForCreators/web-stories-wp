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
 * Internal dependencies
 */
import { List } from '../../../../design-system';
import { useStory } from '../../../app';
import {
  PRIORITY_COPY,
  PUBLISHER_LOGO_DIMENSION,
} from '../../../app/prepublish/newConstants';
import { states, useHighlights } from '../../../app/highlights';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';

export function publisherLogoSize(story) {
  return (
    story.publisherLogo?.height < PUBLISHER_LOGO_DIMENSION ||
    story.publisherLogo?.width < PUBLISHER_LOGO_DIMENSION
  );
}

const PublisherLogoSize = () => {
  const { story } = useStory(({ state }) => state);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const { footer, title } = PRIORITY_COPY.logoTooSmall;
  return (
    publisherLogoSize(story) && (
      <ChecklistCard
        title={title}
        titleProps={{
          onClick: () => setHighlights({ highlight: states.PUBLISHER_LOGO }),
        }}
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List>{footer}</List>
          </ChecklistCardStyles.CardListWrapper>
        }
      />
    )
  );
};

export default PublisherLogoSize;
