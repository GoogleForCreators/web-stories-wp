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
 * Renders AMP boilerplate
 *
 * @see https://amp.dev/documentation/guides-and-tutorials/learn/spec/amp-boilerplate/
 * @see https://amp.dev/documentation/components/amp-story/#boilerplate
 * @return {Element} AMP boilerplate.
 */
function Boilerplate() {
  return (
    <>
      <style
        amp-boilerplate=""
        dangerouslySetInnerHTML={{
          __html:
            'body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}',
        }}
      />
      <noscript>
        <style
          amp-boilerplate=""
          dangerouslySetInnerHTML={{
            __html:
              'body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}',
          }}
        />
      </noscript>
    </>
  );
}

export default Boilerplate;
