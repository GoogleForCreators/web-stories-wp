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
import styled from 'styled-components';

const Banner = styled.div.attrs({ id: 'dillon' })`
  height: 161px;
  margin: 0 20px;
  background-image: url('/wp-content/plugins/web-stories/assets/images/analytics-banner-bg.png');
  text-align: center;
`;

const CheckBox = styled.input.attrs({
  type: 'checkbox',
  // id: 'telemetry-banner-opt-in',
})`
  height: 18px;
  width: 18px;
  margin: 0 12px 0 0;
  /* flex: 1 0 18px; */
`;

export default function TelemetryBanner() {
  return (
    <Banner>
      <h2>{'Help improve the editor!'}</h2>
      <CheckBox />
      <p>
        {`Check the box to help us imporve the Web Stories plugin by allowing
      tracking of product usage stats. All data are treated in accordance
      with Google Privacy Policy`}
      </p>
      <span>{`You can update your selection later by visiting Settings.`}</span>
    </Banner>
  );
}
