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
import { useCallback } from '@googleforcreators/react';
import { List, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { states, useHighlights } from '../../../app/highlights';
import { ChecklistCard, ChecklistCardStyles } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function publisherLogoMissing(publisherLogo) {
  return !publisherLogo?.id;
}

const PublisherLogoMissing = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const publisherLogo = useStory(({ state }) => state?.story?.publisherLogo);
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);
  const handleClick = useCallback(
    () =>
      setHighlights({
        highlight: states.PublisherLogo,
      }),
    [setHighlights]
  );

  const isRendered = publisherLogoMissing(publisherLogo);
  useRegisterCheck('PublisherLogoMissing', isRendered);

  const { footer, title } = PRIORITY_COPY.noPublisherLogo;
  return (
    isRendered &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        titleProps={{
          onClick: handleClick,
        }}
        footer={
          <ChecklistCardStyles.CardListWrapper>
            <List size={TextSize.XSmall}>{footer}</List>
          </ChecklistCardStyles.CardListWrapper>
        }
      />
    )
  );
};

export default PublisherLogoMissing;
