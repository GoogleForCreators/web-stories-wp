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
import {
  useCallback,
  useState,
  useRef,
  useEffect,
} from '@web-stories-wp/react';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Checkbox,
  Link,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { TranslateWithMarkup, __ } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';
import styled from 'styled-components';
import {
  useConfig,
  useCurrentUser,
  useIsChecklistMounted,
  useStory,
  ChecklistCard,
  DefaultFooterText,
} from '@web-stories-wp/story-editor';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const BoldText = styled(Text).attrs({ as: 'span', isBold: true })`
  color: ${({ theme }) => theme.colors.standard.white};
`;

const DescriptionText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin-bottom: 16px;
`;

const CheckboxLabel = styled(DescriptionText)`
  margin-left: 8px;
  margin-bottom: 0;
  line-height: 20px;
  cursor: pointer;
`;

function VideoOptimizationCheckbox() {
  const isChecklistMounted = useIsChecklistMounted();
  const { capabilities: { hasUploadMediaAction } = {}, dashboardSettingsLink } =
    useConfig();
  const [hasOptedIn, setHasOptedIn] = useState(false);
  const saveButtonRef = useRef();
  const { currentUser, toggleWebStoriesMediaOptimization } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      toggleWebStoriesMediaOptimization:
        actions.toggleWebStoriesMediaOptimization,
    })
  );

  const checked = currentUser?.meta?.web_stories_media_optimization;
  const showCheckbox = !checked && hasUploadMediaAction;

  const handleToggle = useCallback(() => {
    setHasOptedIn(true);
    toggleWebStoriesMediaOptimization();
  }, [toggleWebStoriesMediaOptimization]);

  const { isSaving, saveStory } = useStory(({ state, actions }) => ({
    isSaving: state.meta.isSaving,
    saveStory: actions.saveStory,
  }));
  const handleSave = async () => {
    await saveStory();
    window.location.reload(true);
  };

  useEffect(() => {
    hasOptedIn && saveButtonRef.current.focus();
  }, [hasOptedIn]);

  return (showCheckbox || hasOptedIn) && isChecklistMounted ? (
    <ChecklistCard
      title={__(
        'Optimize all videos in the Story to ensure smooth playback.',
        'web-stories'
      )}
      footer={
        hasOptedIn ? (
          <>
            <DefaultFooterText>
              <TranslateWithMarkup
                mapping={{
                  b: <BoldText />,
                }}
              >
                {__(
                  'Automatic video optimization enabled. <b>Reload the page</b> to apply changes.',
                  'web-stories'
                )}
              </TranslateWithMarkup>
            </DefaultFooterText>
            <ButtonContainer>
              <Button
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onClick={handleSave}
                disabled={isSaving}
                ref={saveButtonRef}
              >
                {__('Save & Reload', 'web-stories')}
              </Button>
            </ButtonContainer>
          </>
        ) : (
          <CheckboxContainer>
            <Checkbox
              id="automatic-video-optimization-toggle"
              checked={currentUser?.meta?.web_stories_media_optimization}
              onChange={handleToggle}
            />
            <CheckboxLabel
              forwardedAs="label"
              htmlFor="automatic-video-optimization-toggle"
            >
              <TranslateWithMarkup
                mapping={{
                  a: (
                    <Link
                      size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                      onClick={(evt) =>
                        trackClick(evt, 'click_video_optimization_settings')
                      }
                      href={dashboardSettingsLink}
                      isBold
                    />
                  ),
                }}
              >
                {__(
                  'Enable automatic optimization. Change this any time in <a>Settings</a>.',
                  'web-stories'
                )}
              </TranslateWithMarkup>
            </CheckboxLabel>
          </CheckboxContainer>
        )
      }
    />
  ) : null;
}

export default VideoOptimizationCheckbox;
