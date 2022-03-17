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
import { FULLBLEED_RATIO, PAGE_RATIO } from '@googleforcreators/units';
import { theme } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import isHexColorString from './isHexColorString';

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
        __html:
          `
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
          ` +
          /*
            The following rule is for Safari only.
            In Safari, the font size is rounded up, causing overflow, this hack undoes this.
            See https://github.com/googleforcreators/web-stories-wp/issues/6323
           */
          `
              @media not all and (min-resolution:.001dpcm) {
                @media {
                  p.text-wrapper > span {
                    font-size: calc(100% - 0.5px);
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

              .element-overlay-area {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
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

              @media (prefers-reduced-motion: no-preference) {
                .animation-wrapper {
                  opacity: var(--initial-opacity);
                  transform: var(--initial-transform);
                }
              }

              amp-story-grid-layer.align-bottom {
                align-content: end;
                padding: 0;
              }

              .captions-area {
                padding: 0 32px 0;
              }

              amp-story-captions {
                margin-bottom: 16px;
                text-align: center;
              }

              amp-story-captions span {
                display: inline-block;
                margin: 0;
                padding: 6px 12px;
                vertical-align: middle;
                border-radius: 15px;
                background: rgba(11, 11, 11, 0.6);
                color: rgba(255, 255, 255, 1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;;
                font-size: calc(4 * var(--story-page-vw));
                line-height: 1.4;
                word-break: break-word;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              `,
      }}
    />
  );
}

export default CustomStyles;
