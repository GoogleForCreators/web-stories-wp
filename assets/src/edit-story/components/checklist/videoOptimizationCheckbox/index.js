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
  Checkbox,
  Link,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { TranslateWithMarkup, __ } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { useConfig, useCurrentUser } from '../../../app';
import { CARD_WIDTH } from '../../helpCenter/navigator/constants';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: ${CARD_WIDTH}px;
  margin: 16px 0;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
  const { capabilities: { hasUploadMediaAction } = {}, dashboardSettingsLink } =
    useConfig();
  const { currentUser, toggleWebStoriesMediaOptimization } = useCurrentUser(
    ({ state, actions }) => ({
      currentUser: state.currentUser,
      toggleWebStoriesMediaOptimization:
        actions.toggleWebStoriesMediaOptimization,
    })
  );

  const checked = currentUser?.meta?.web_stories_media_optimization;
  const showCheckbox = !checked && hasUploadMediaAction;

  return showCheckbox ? (
    <Container>
      <DescriptionText>
        {__(
          'Optimize all videos in the Story to ensure smooth playback.',
          'web-stories'
        )}
      </DescriptionText>
      <CheckboxContainer>
        <Checkbox
          id="automatic-video-optimization-toggle"
          checked={currentUser?.meta?.web_stories_media_optimization}
          onChange={toggleWebStoriesMediaOptimization}
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
    </Container>
  ) : null;
}

export default VideoOptimizationCheckbox;
