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
import { useState, useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { StoryPropType } from '../../../types';

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Container = styled.div`
  padding: 20px;
`;

const Submit = styled.input`
  display: block;
  margin-top: 10px;
`;

function UpdateTemplateForm({ story }) {
  const [includeAnimations, setIncludeAnimations] = useState(false);

  const toggleIncludeAnimations = useCallback(() => {
    setIncludeAnimations((prevIncludeAnimations) => !prevIncludeAnimations);
  }, []);

  const handleTemplateUpdate = useCallback(
    (e) => {
      e.preventDefault();

      const pages = includeAnimations
        ? story.pages
        : story.pages.reduce((acc, page) => {
            const { animations, ...rest } = page;
            return [...acc, { ...rest }];
          }, []);

      const { story_data } = story.originalStoryData;

      // eslint-disable-next-line no-console
      console.log({
        ...story_data,
        pages,
      });
    },
    [story, includeAnimations]
  );

  return (
    <Container>
      <form onSubmit={handleTemplateUpdate}>
        <Title>{story.title}</Title>
        <label htmlFor="animation">{'Include Animations?'}</label>
        <input
          id="animation"
          type="checkbox"
          onClick={toggleIncludeAnimations}
          value={includeAnimations}
        />
        <Submit type="submit" value="Log Story Data to Console" />
      </form>
    </Container>
  );
}

UpdateTemplateForm.propTypes = {
  story: StoryPropType.isRequired,
};

export default UpdateTemplateForm;
