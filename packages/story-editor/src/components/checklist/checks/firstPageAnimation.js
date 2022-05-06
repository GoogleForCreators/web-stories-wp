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
import { useCallback } from '@googleforcreators/react';
import { Link, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { trackClick } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { DESIGN_COPY } from '../constants';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

export function firstPageAnimation(animations) {
  return Boolean(animations?.length);
}

const FirstPageAnimation = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const isRendered = useStory(({ state: { pages } }) =>
    firstPageAnimation(pages[0]?.animations)
  );

  const onClick = useCallback((evt) => {
    trackClick(evt, 'click_checklist_cover_animations');
  }, []);

  const { title, footer } = DESIGN_COPY.firstPageAnimation;
  useRegisterCheck('FirstPageAnimation', isRendered);

  return isRendered && isChecklistMounted ? (
    <ChecklistCard
      title={title}
      footer={
        <>
          <DefaultFooterText>{footer}</DefaultFooterText>
          <Link
            onClick={onClick}
            href="https://wp.stories.google/docs/how-to/animations/"
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
          >
            {'Learn more'}
          </Link>
        </>
      }
    />
  ) : null;
};

export default FirstPageAnimation;
