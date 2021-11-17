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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Tags from '../tags';

const Bg = styled.div`
  height: calc(100vh - 32px);
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const Wrapper = styled.div`
  position: relative;
  width: 250px;
  inset: 15vh 0 0 0;
  margin: auto;
`;

export default {
  title: 'Stories Editor/Components/Form/Tags',
  component: Tags,
};

export const _default = () => {
  return (
    <Bg>
      <Wrapper>
        <Tags.Label htmlFor="tags-input">{'Add New Tag'}</Tags.Label>
        <Tags.Input
          id="tags-input"
          aria-describedby="tags-description"
          name="web_story_tag"
          suggestedTerms={[
            { name: 'banana', id: 1 },
            { name: 'anna', id: 2 },
            { name: 'nana', id: 3 },
          ]}
        />
        <Tags.Description id="tags-description">
          {'Separate with commas or the Enter key.'}
        </Tags.Description>
      </Wrapper>
    </Bg>
  );
};
