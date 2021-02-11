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
 * Internal dependencies
 */
import { FULLBLEED_RATIO, PAGE_RATIO } from '../../constants';
import theme from '../../theme';

function isHexColorString(s) {
  return /^#(?:[a-f0-9]{3}){1,2}$/i.test(s);
}

function CustomStyles() {
  const safeToFullRatio = PAGE_RATIO / FULLBLEED_RATIO;
  const fullToSafeRatio = 1 / safeToFullRatio;
  const safeRatio = PAGE_RATIO;
  const fullRatio = FULLBLEED_RATIO;

  // Make the story content aligned with top of viewport between aspect ratios
  // 320:678 and 9:16. This ensures that the story's system UI (progress bar,
  // share button) is either completely overlapping or not overlapping the story
  // content (i.e. never partially overlapping). The icon height is 48px. Based
  // on research, the smallest screen size in active use is 320 pixels wide. In
  // this case, the minimum screen width that this ratio will work for it 320px.
  const gridLayerExpandLowerBound = '320 / 678';
  const gridLayerExpandUpperBound = '9 / 16';

  // Match page background color to the workspace background color.
  // Validate since we're using dangerouslySetInnerHTML with imported variable.
  const workspaceColor = theme.colors.bg.primary;
  const pageBackgroundColor = isHexColorString(workspaceColor)
    ? workspaceColor
    : '#1B1D1C';

  return (
    <style
      amp-custom=""
      dangerouslySetInnerHTML={{
        __html: `
              amp-story-page {
                background-color: ${pageBackgroundColor};
              }

              amp-story-grid-layer {
                overflow: visible;
              }

              @media (max-aspect-ratio: ${gridLayerExpandUpperBound})  {
                @media (min-aspect-ratio: ${gridLayerExpandLowerBound}) {
                  amp-story-grid-layer.grid-layer {
                    margin-top: calc((100% / ${fullRatio} - 100% / ${safeRatio}) / 2);
                  }
                }
              }

              .page-fullbleed-area,
              .page-background-overlay-area {
                position: absolute;
                overflow: hidden;
                width: 100%;
                left: 0;
                height: calc(${safeToFullRatio} * 100%);
                top: calc((1 - ${safeToFullRatio}) * 100% / 2);
              }

              .page-safe-area {
                overflow: visible;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                height: calc(${fullToSafeRatio} * 100%);
                margin: auto 0;
              }

              .mask {
                position: absolute;
                overflow: hidden;
              }

              .fill {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0;
              }
              `,
      }}
    />
  );
}

export default CustomStyles;
