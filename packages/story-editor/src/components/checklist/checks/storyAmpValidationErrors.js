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
import { trackEvent } from '@googleforcreators/tracking';
import { useEffect, useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { useRegisterCheck } from '../countContext';

/** @typedef {import('amphtml-validator').ValidationResult} ValidationResult */

export async function getStoryAmpValidationErrors({ link, status }) {
  if (!link || !['publish', 'future'].includes(status)) {
    return false;
  }

  try {
    const response = await fetch(link);
    const storyMarkup = await response.text();

    await window.amp.validator.init();

    /**
     * @type {ValidationResult}
     */
    const validationResult = window.amp.validator.validateString(storyMarkup);
    const { status: markupStatus, errors } = validationResult;

    if ('FAIL' !== markupStatus) {
      return false;
    }
    // Error codes can be found here: // https://github.com/ampproject/amphtml/blob/cfb102aafc1543788b77f3ef9bd138c753e13097/validator/validator.proto#L853
    const filteredErrors = errors
      .filter(({ severity }) => severity === 'ERROR')
      .filter(({ code, params }) => {
        // Filter out errors that are covered in other checks
        // Already covered by metadata checks.

        // Missing story poster
        if ('MISSING_URL' === code && params?.[0].startsWith('poster')) {
          return false;
        }

        // Missing publisher logo
        if (
          'MISSING_URL' === code &&
          params?.[0].startsWith('publisher-logo')
        ) {
          return false;
        }
        // Missing video posters
        if ('INVALID_URL_PROTOCOL' === code && params?.[0].startsWith('src')) {
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
  // ampValidationErrorRef is making sure that tracking is only fired once per session.
  const ampValidationErrorsRef = useRef();
  const { isSaving, link, status } = useStory(({ state }) => ({
    isSaving: state.meta.isSaving,
    link: state.story.link,
    status: state.story.status,
  }));

  // isRendered is getting set asynchronously based on the returned value of `getStoryAmpValidationErrors`,
  // setting this statefully allows the value to be a boolean not a promise which is crucial to updating tracking accurately.
  const [isRendered, setIsRendered] = useState(false);

  // using `isSaving` as an indicator of when to check for validation errors so that this check doesn't run on all story updates.
  // Allows us to just track status and link, puts the story in line with what the outcome would be if the user was testing their
  // story link in the recommended test/amp site.
  useEffect(() => {
    if (!isSaving) {
      getStoryAmpValidationErrors({ link, status }).then((hasErrors) => {
        setIsRendered(hasErrors);
        if (hasErrors && !ampValidationErrorsRef?.current) {
          ampValidationErrorsRef.current = true;
        }
      });
    }
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
