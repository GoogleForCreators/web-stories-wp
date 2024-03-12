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
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, TranslateWithMarkup } from '@googleforcreators/i18n';
import { trackClick, trackEvent } from '@googleforcreators/tracking';
import {
  ButtonSize,
  ButtonType,
  TextSize,
  NotificationBubble,
  Icons,
  Text,
  Link,
  DropDown,
} from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { validateGoogleAnalyticsIdFormat } from '../utils';
import {
  InlineForm,
  InlineLink,
  SaveButton,
  SettingForm,
  SettingHeading,
  SettingsTextInput,
  SettingSubheading,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../components';
import { GOOGLE_ANALYTICS_HANDLER_TYPE } from '../../../constants/settings';

const StyledNotificationBubble = styled(NotificationBubble)`
  display: inline-block;
  margin-left: 10px;
`;

export const TEXT = {
  CONTEXT: __(
    'The story editor will append a default, configurable AMP analytics configuration to your story. If you’re interested in going beyond what the default configuration, read this <a>article</a>.',
    'web-stories'
  ),
  CONTEXT_LINK:
    'https://blog.amp.dev/2019/08/28/analytics-for-your-amp-stories/',
  SECTION_HEADING: __('Google Analytics', 'web-stories'),
  PLACEHOLDER: __('Enter your Google Analytics Measurement ID', 'web-stories'),
  ARIA_LABEL: __('Enter your Google Analytics Measurement ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
  SITE_KIT_NOT_INSTALLED: __(
    'Install <a>Site Kit by Google</a> to easily enable Google Analytics for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_INSTALLED: __(
    'Use Site Kit by Google to easily<a>activate Google Analytics</a> for Web Stories.',
    'web-stories'
  ),
  SITE_KIT_IN_USE: __(
    '<b>Note: </b>If Site Kit is active, it will be used to set up Google Analytics by default. However, you can customize the behavior in case you need more flexibility.',
    'web-stories'
  ),
  ANALYTICS_DROPDOWN_LABEL: __('Analytics Type', 'web-stories'),
  ANALYTICS_DROPDOWN_PLACEHOLDER: __('Select Analytics Type', 'web-stories'),
};

export const ANALYTICS_DROPDOWN_OPTIONS = [
  {
    value: GOOGLE_ANALYTICS_HANDLER_TYPE.SITE_KIT,
    label: __('Use Site Kit for analytics (default)', 'web-stories'),
  },
  {
    value: GOOGLE_ANALYTICS_HANDLER_TYPE.WEB_STORIES,
    label: __('Use only Web Stories for analytics', 'web-stories'),
  },
  {
    value: GOOGLE_ANALYTICS_HANDLER_TYPE.BOTH,
    label: __('Use both', 'web-stories'),
  },
];

const DropdownContainer = styled.div`
  padding-top: 12px;
`;

const WarningContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 14px auto;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 8px;
`;

const WarningIcon = styled(Icons.ExclamationOutline)`
  width: 32px;
  height: 100%;
  color: ${({ theme }) => theme.colors.status.warning};
`;

const Message = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})`
  max-width: calc(100% - 40px);
`;

function GoogleAnalyticsSettings({
  googleAnalyticsId,
  handleUpdateAnalyticsId,
  usingLegacyAnalytics,
  handleMigrateLegacyAnalytics,
  siteKitStatus = {},
  googleAnalyticsHandler,
  handleUpdateGoogleAnalyticsHandler,
}) {
  const [analyticsId, setAnalyticsId] = useState(googleAnalyticsId);
  const [analyticsHandler, setAnalyticsHandler] = useState(
    googleAnalyticsHandler
  );
  const [inputError, setInputError] = useState('');
  const canSave = analyticsId !== googleAnalyticsId && !inputError;
  const disableSaveButton = !canSave;

  const { analyticsActive, installed, analyticsLink } = siteKitStatus;

  useEffect(() => {
    setAnalyticsId(googleAnalyticsId);
  }, [googleAnalyticsId]);

  useEffect(() => {
    setAnalyticsHandler(googleAnalyticsHandler);
  }, [googleAnalyticsHandler]);

  const onUpdateAnalyticsId = useCallback((event) => {
    const { value } = event.target;
    setAnalyticsId(value);

    if (value.length === 0 || validateGoogleAnalyticsIdFormat(value)) {
      setInputError('');

      return;
    }

    setInputError(TEXT.INPUT_ERROR);
  }, []);

  const onUpdateAnalyticsHandler = useCallback(
    (value) => {
      setAnalyticsHandler(value);
      handleUpdateGoogleAnalyticsHandler(value);
    },
    [handleUpdateGoogleAnalyticsHandler]
  );

  const handleOnSave = useCallback(() => {
    if (canSave) {
      handleUpdateAnalyticsId(analyticsId);
    }
  }, [canSave, analyticsId, handleUpdateAnalyticsId]);

  const handleOnKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleOnSave();
      }
    },
    [handleOnSave]
  );

  const handleAnalyticsMigration = useCallback(
    (evt) => {
      evt.preventDefault();
      handleMigrateLegacyAnalytics();
      trackEvent('migrate_story_auto_analytics');
    },
    [handleMigrateLegacyAnalytics]
  );

  const onAutoAnalyticsClick = useCallback(
    (evt) => trackClick(evt, 'click_auto_analytics_link'),
    []
  );

  const onSiteKitClick = useCallback(
    (evt) => trackClick(evt, 'click_site_kit_link'),
    []
  );

  const onContextClick = useCallback(
    (evt) => trackClick(evt, 'click_analytics_docs'),
    []
  );

  const siteKitDisplayText = useMemo(() => {
    if (analyticsActive) {
      return null;
    }

    return (
      <TranslateWithMarkup
        mapping={{
          a: (
            <InlineLink
              href={analyticsLink}
              rel="noreferrer"
              target="_blank"
              size={TextSize.Small}
              onClick={onSiteKitClick}
            />
          ),
        }}
      >
        {installed ? TEXT.SITE_KIT_INSTALLED : TEXT.SITE_KIT_NOT_INSTALLED}
      </TranslateWithMarkup>
    );
  }, [analyticsActive, installed, analyticsLink, onSiteKitClick]);

  return (
    <SettingForm onSubmit={(e) => e.preventDefault()}>
      <div>
        <SettingHeading htmlFor="gaTrackingID" as="h3">
          {TEXT.SECTION_HEADING}
          {usingLegacyAnalytics && (
            <StyledNotificationBubble notificationCount={1} isSmall />
          )}
        </SettingHeading>
        <SettingSubheading size={TextSize.Small}>
          {siteKitDisplayText}
        </SettingSubheading>
        {usingLegacyAnalytics && (
          <>
            <SettingSubheading size={TextSize.Small}>
              <TranslateWithMarkup
                mapping={{
                  a: (
                    <InlineLink
                      href="https://wp.stories.google/docs/seo/"
                      rel="noreferrer"
                      target="_blank"
                      size={TextSize.Small}
                      onClick={onAutoAnalyticsClick}
                    />
                  ),
                }}
              >
                {__(
                  'An improved analytics configuration is now available. <a>Learn more</a>.',
                  'web-stories'
                )}
              </TranslateWithMarkup>
            </SettingSubheading>
            <SettingSubheading size={TextSize.Small}>
              <SaveButton
                type={ButtonType.Secondary}
                size={ButtonSize.Small}
                onClick={handleAnalyticsMigration}
              >
                {__('Migrate', 'web-stories')}
              </SaveButton>
            </SettingSubheading>
          </>
        )}
      </div>
      <div>
        <InlineForm>
          <VisuallyHiddenLabel htmlFor="gaTrackingId">
            {TEXT.ARIA_LABEL}
          </VisuallyHiddenLabel>
          <SettingsTextInput
            aria-label={TEXT.ARIA_LABEL}
            id="gaTrackingId"
            value={analyticsId}
            onChange={onUpdateAnalyticsId}
            onKeyDown={handleOnKeyDown}
            placeholder={TEXT.PLACEHOLDER}
            hasError={Boolean(inputError)}
            hint={inputError}
          />
          <SaveButton
            type={ButtonType.Secondary}
            size={ButtonSize.Small}
            disabled={disableSaveButton}
            onClick={handleOnSave}
          >
            {TEXT.SUBMIT_BUTTON}
          </SaveButton>
        </InlineForm>
        <TextInputHelperText size={TextSize.Small}>
          <TranslateWithMarkup
            mapping={{
              a: (
                <InlineLink
                  href={TEXT.CONTEXT_LINK}
                  rel="noreferrer"
                  target="_blank"
                  size={TextSize.Small}
                  onClick={onContextClick}
                />
              ),
            }}
          >
            {TEXT.CONTEXT}
          </TranslateWithMarkup>
        </TextInputHelperText>
        {analyticsActive && (
          <>
            <TextInputHelperText size={TextSize.Small}>
              <TranslateWithMarkup>{TEXT.SITE_KIT_IN_USE}</TranslateWithMarkup>
            </TextInputHelperText>
            <DropdownContainer>
              <DropDown
                id="analyticsType"
                ariaLabel={TEXT.ANALYTICS_DROPDOWN_LABEL}
                placeholder={TEXT.ANALYTICS_DROPDOWN_PLACEHOLDER}
                options={ANALYTICS_DROPDOWN_OPTIONS}
                onMenuItemClick={(_, newValue) => {
                  onUpdateAnalyticsHandler(newValue);
                }}
                selectedValue={analyticsHandler}
              />
            </DropdownContainer>
          </>
        )}
        {!googleAnalyticsId || googleAnalyticsId.startsWith('UA-') ? (
          <WarningContainer>
            <WarningIcon aria-hidden />
            <Message>
              <TranslateWithMarkup
                mapping={{
                  a: (
                    <Link
                      href={__(
                        'https://support.google.com/analytics/answer/11583528?hl=en',
                        'web-stories'
                      )}
                      rel="noreferrer"
                      target="_blank"
                      size={TextSize.Small}
                      onClick={(evt) =>
                        trackClick(evt, 'click_ua_deprecation_docs')
                      }
                    />
                  ),
                  a2: (
                    <Link
                      href={__(
                        'https://support.google.com/analytics/answer/10089681?hl=en',
                        'web-stories'
                      )}
                      rel="noreferrer"
                      target="_blank"
                      size={TextSize.Small}
                      onClick={(evt) => trackClick(evt, 'click_ga4_docs')}
                    />
                  ),
                }}
              >
                {__(
                  'As <a>previously announced</a>, Universal Analytics will stop processing new visits starting <b>July 1, 2023</b>. We recommend switching to <a2>Google Analytics 4</a2> (GA4), our analytics product of record.',
                  'web-stories'
                )}
              </TranslateWithMarkup>
            </Message>
          </WarningContainer>
        ) : null}
      </div>
    </SettingForm>
  );
}

GoogleAnalyticsSettings.propTypes = {
  googleAnalyticsId: PropTypes.string,
  handleUpdateAnalyticsId: PropTypes.func,
  usingLegacyAnalytics: PropTypes.bool,
  handleMigrateLegacyAnalytics: PropTypes.func,
  siteKitStatus: PropTypes.shape({
    installed: PropTypes.bool,
    active: PropTypes.bool,
    adsenseActive: PropTypes.bool,
    analyticsActive: PropTypes.bool,
    analyticsLink: PropTypes.string,
  }),
  googleAnalyticsHandler: PropTypes.string,
  handleUpdateGoogleAnalyticsHandler: PropTypes.func,
};

export default GoogleAnalyticsSettings;
