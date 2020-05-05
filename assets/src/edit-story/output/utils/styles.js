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

function CustomStyles() {
  return (
    <style
      amp-custom=""
      dangerouslySetInnerHTML={{
        __html: `
              amp-story-grid-layer {
                overflow: visible;
              }

              .page-background-area,
              .page-background-overlay-area,
              .page-safe-area {
                position: absolute;
                overflow: visible;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
              }

              .page-cta-area {
                position: absolute;
                overflow: hidden;
                left: 0;
                right: 0;
                bottom: 0;
                height: calc(100 * var(--story-page-vh, 1vh));
              }

              .page-background-area img, .page-background-area video {
                object-fit: cover;
              }

              .wrapper {
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
