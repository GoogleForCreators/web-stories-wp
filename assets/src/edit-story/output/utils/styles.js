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

const HEX_CHARS = '1234567890ABCDEF';

function isHexColorString(s) {
  return (
    s[0] == '#' &&
    s
      .substr(1)
      .split('')
      .every((char) => HEX_CHARS.includes(char))
  );
}

function CustomStyles() {
  const safeToFullRatio = PAGE_RATIO / FULLBLEED_RATIO;
  const fullToSafeRatio = 1 / safeToFullRatio;

  // Match page background color to the workspace background color.
  // Validate since we're using dangerouslySetInnerHTML with imported variable.
  const workspaceColor = theme.colors.bg.workspace;
  let pageBackgroundColor = isHexColorString(workspaceColor)
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
