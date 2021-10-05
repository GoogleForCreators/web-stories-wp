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
import { TranslateWithMarkup, __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { Link, THEME_CONSTANTS } from '@web-stories-wp/design-system';
import { useConfig } from '../../../app';
import { ChecklistCard, DefaultFooterText } from '../../checklistCard';
import { PRIORITY_COPY } from '../constants';
import { useRegisterCheck } from '../countContext';
import { useIsChecklistMounted } from '../popupMountedContext';

const StoryMissingPublisherName = () => {
  const isChecklistMounted = useIsChecklistMounted();
  const { generalSettingsLink, publisherName } = useConfig(
    ({ metadata, generalSettingsLink }) => ({
      publisherName: metadata?.publisher,
      generalSettingsLink,
    })
  );
  const hasPublisherName = publisherName?.trim().length > 0;

  const { title } = PRIORITY_COPY.storyMissingPublisherName;

  useRegisterCheck('StoryMissingPublisherName', !hasPublisherName);

  return (
    !hasPublisherName &&
    isChecklistMounted && (
      <ChecklistCard
        title={title}
        footer={
          <DefaultFooterText>
            <TranslateWithMarkup
              mapping={{
                a: (
                  <Link
                    href={generalSettingsLink}
                    rel="noreferrer"
                    target="_blank"
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
                  />
                ),
              }}
            >
              {__(
                'Your site title is used when your Story appears on Google. You can set your site title by going to <a>General Settings</a>.',
                'web-stories'
              )}
            </TranslateWithMarkup>
          </DefaultFooterText>
        }
      />
    )
  );
};

export default StoryMissingPublisherName;
