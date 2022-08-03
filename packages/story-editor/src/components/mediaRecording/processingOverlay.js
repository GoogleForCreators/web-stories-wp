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
import { __ } from '@googleforcreators/i18n';
import { Text, LoadingSpinner } from '@googleforcreators/design-system';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(0 0 0 / 0.5);
  gap: 2em;
  padding: 3em;
`;

function ProcessingOverlay() {
  return (
    <Wrapper>
      <LoadingSpinner />
      <Text>
        {__(
          'Video trimming in progress. Please wait up to a few minutes depending on output video length.',
          'web-stories'
        )}
      </Text>
    </Wrapper>
  );
}

export default ProcessingOverlay;
