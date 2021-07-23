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
import { trackEvent } from '@web-stories-wp/tracking';
import { useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { useRegisterCheck } from '../countContext';

export async function getStoryAmpValidationErrors({ link, status }) {
  // TODO: Enable for drafts as well?
  if (!link || !['publish', 'future'].includes(status)) {
    return false;
  }

  try {
    const storyMarkup = await (await fetch(link)).text();
    const { status: markupStatus, errors } =
      window.amp.validator.validateString(storyMarkup);

    if ('FAIL' !== markupStatus) {
      return false;
    }

    const filteredErrors = errors
      .filter(({ severity }) => severity === 'ERROR')
      .filter(({ code, params }) => {
        // Filter out errors that are covered in other checks
        // Already covered by metadata checks.
        if ('MISSING_URL' === code && params[0].startsWith('poster')) {
          return false;
        }

        return true;
      });
    return filteredErrors.length > 0;
  } catch {
    return false;
  }
}

const StoryAmpValidationErrors = () => {
  const ampValidationErrorsRef = useRef();
  const {
    meta: { isSaving },
    story: { link, status },
  } = useStory(({ state }) => state);

  // limiting to when isSaving is false so that when the saved story is updated this will check.
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    !isSaving &&
      getStoryAmpValidationErrors({ link, status }).then((hasErrors) => {
        setIsRendered(hasErrors);
        if (hasErrors && !ampValidationErrorsRef?.current) {
          ampValidationErrorsRef.current = true;
        }
        return hasErrors;
      });
  }, [link, status, isSaving]);

  useEffect(() => {
    if (isRendered && ampValidationErrorsRef?.current) {
      trackEvent('amp_validation_errors_found');
    }
  }, [isRendered]);

  useRegisterCheck('StoryHasAmpErrors', isRendered);
  const { footer, title } = PRIORITY_COPY.ampValidation;

  return (
    isRendered && (
      <ChecklistCard
        title={title}
        footer={<DefaultFooterText>{footer}</DefaultFooterText>}
      />
    )
  );
};

export default StoryAmpValidationErrors;
