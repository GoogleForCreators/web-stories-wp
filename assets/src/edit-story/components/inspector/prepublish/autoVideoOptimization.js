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
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { __, TranslateWithMarkup } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { Link, THEME_CONSTANTS } from '../../../../design-system';
import { useConfig } from '../../../app';
import {
  DescriptionText,
  PageIndicator,
  StyledToggle,
  ToggleGroup,
  VideoOptimizationGroup,
} from './styles';

const AutoVideoOptimization = ({
  areVideosAutoOptimized,
  onAutoOptimizeVideoClick,
}) => {
  const { dashboardSettingsLink } = useConfig();

  const wereVideosInitiallyAutoOptimized = useRef(areVideosAutoOptimized);

  useEffect(() => {
    // areVideosAutoOptimized may be undefined initially since we
    // are waiting on an api call. Once that is done, we can see the
    // value of the `areVideosAutoOptimized`
    if (
      areVideosAutoOptimized &&
      wereVideosInitiallyAutoOptimized.current === undefined
    ) {
      wereVideosInitiallyAutoOptimized.current = true;
    }
  }, [areVideosAutoOptimized]);

  if (wereVideosInitiallyAutoOptimized.current) {
    return null;
  }

  return (
    <VideoOptimizationGroup>
      <PageIndicator>{__('General', 'web-stories')}</PageIndicator>
      <DescriptionText>
        {__(
          'Optimize all videos in the Story to ensure smooth playback.',
          'web-stories'
        )}
      </DescriptionText>
      <ToggleGroup>
        <StyledToggle
          id="automatic-video-optimization-toggle"
          aria-label={__('Enable automatic video optimization', 'web-stories')}
          checked={areVideosAutoOptimized || false}
          onChange={onAutoOptimizeVideoClick}
        />
        <DescriptionText
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
                />
              ),
            }}
          >
            {__(
              'Enable automatic optimization. Change this any time in <a>Settings</a>.',
              'web-stories'
            )}
          </TranslateWithMarkup>
        </DescriptionText>
      </ToggleGroup>
    </VideoOptimizationGroup>
  );
};
AutoVideoOptimization.propTypes = {
  areVideosAutoOptimized: PropTypes.bool,
  onAutoOptimizeVideoClick: PropTypes.func.isRequired,
};

export default AutoVideoOptimization;
