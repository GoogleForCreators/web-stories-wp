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
import {
  StoryGrid,
  CardGridItem,
  CardTitle,
  CardPreviewContainer,
  PreviewPage,
} from '../../../components';
import { StoriesPropType } from '../../../types';

const StoryGridView = ({ filteredStories }) => (
  <StoryGrid>
    {filteredStories.map((story) => (
      <CardGridItem key={story.id}>
        <CardPreviewContainer
          editUrl={story.editStoryUrl}
          onPreviewClick={() => {}}
          previewSource={'http://placeimg.com/225/400/nature'}
        >
          <PreviewPage page={story.pages[0]} />
        </CardPreviewContainer>
        <CardTitle
          title={story.title}
          modifiedDate={story.modified.startOf('day').fromNow()}
        />
      </CardGridItem>
    ))}
  </StoryGrid>
);

StoryGridView.propTypes = {
  filteredStories: StoriesPropType,
};

export default StoryGridView;
