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
 * Internal dependencies
 */
import { updateSlug } from '../storyUpdates';

describe('storyUpdates', () => {
  describe('updateSlug', () => {
    const updateStory = jest.fn();

    afterEach(() => {
      updateStory.mockReset();
    });

    it('should call updateStory with newly formed slug when a slug did not already exist', () => {
      updateSlug({
        currentSlug: '',
        currentTitle: 'Top 10 Summer Sparkling Water Flavors',
        storyId: 58,
        updateStory,
      });

      expect(updateStory).toHaveBeenCalledWith({
        properties: { slug: 'top-10-summer-sparkling-water-flavors' },
      });
    });

    it('should call fn with updated slug as story title when story id matches current slug and story title exists', () => {
      updateSlug({
        currentSlug: '59',
        currentTitle: 'Top 10 Summer Blockbusters',
        storyId: 59,
        updateStory,
      });

      expect(updateStory).toHaveBeenCalledWith({
        properties: { slug: 'top-10-summer-blockbusters' },
      });
    });

    it('should call fn with updated slug as story id when story id matches current slug and story title does not exist (fallback)', () => {
      updateSlug({
        currentSlug: '59',
        currentTitle: '',
        storyId: 59,
        updateStory,
      });

      expect(updateStory).toHaveBeenCalledWith({
        properties: { slug: 59 },
      });
    });

    it('should not call fn with there is a slug present', () => {
      updateSlug({
        currentSlug: '10-reasons-to-go-for-a-walk',
        currentTitle: '',
        storyId: 10,
        updateStory,
      });

      expect(updateStory).not.toHaveBeenCalled();
    });
  });
});
