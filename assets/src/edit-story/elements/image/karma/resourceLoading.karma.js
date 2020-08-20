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
import { Fixture } from '../../../karma';
import resourceList from '../../../utils/resourceList';
import { useStory } from '../../../app/story';

describe('Image resource loading integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should use cached thumbnail then switch to fullsize', async () => {
    const image = fixture.screen.getAllByLabelText('curiosity');
    expect(resourceList[2]).toEqual(undefined);

    await fixture.events.mouse.clickOn(image[0], 10, 10);
    expect(resourceList[2].type).toEqual('cached');

    await fixture.events.sleep(100); // Wait a bit for fullsize timeout

    expect(resourceList[2].type).toEqual('fullsize');
    const frames = fixture.screen.getAllByTestId('frameElement');
    const imageFrame = frames[1];
    const imageId = imageFrame.dataset.elementId;
    const imageTag = fixture.editor.canvas.displayLayer
      .display(imageId)
      .node.querySelector('img');

    const storyContext = await fixture.renderHook(() => useStory());
    const storyDataSrc =
      storyContext.state.currentPage.elements[1].resource.src;

    expect(imageTag.src).toEqual(storyDataSrc);
  });
});
