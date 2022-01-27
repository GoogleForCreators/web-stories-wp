/*
 * Copyright 2022 Google LLC
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

const Main = styled.div`
  display: grid;
  min-width: 917px;
  margin: 0 -3.7% 0 3.7%;
  grid-column-gap: 3.7%;
  /* grid-template-columns: 230px 276px 308px; */
  grid-template-columns: 25% 30% 34%;
  border: 1px solid lime;
`;

const StoryPreview = styled.div`
  display: block;
  border: 1px solid orange;
`;

const MandatoryStoryInfo = styled.div`
  border: 1px solid red;
`;

const PlatformSpecificStoryInfo = styled.div`
  border: 1px solid yellow;
`;

const MainContent = () => {
  return (
    <Main>
      <StoryPreview>
        <img src="http://placekitten.com/230/342" alt="jalkdjflkj" />
      </StoryPreview>
      <MandatoryStoryInfo>
        <input type="text" />
      </MandatoryStoryInfo>
      <PlatformSpecificStoryInfo>
        <p>{'panels here'}</p>
      </PlatformSpecificStoryInfo>
    </Main>
  );
};

export default MainContent;
