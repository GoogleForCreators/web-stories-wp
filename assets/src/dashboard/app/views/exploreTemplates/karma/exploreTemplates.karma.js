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
import Fixture from '../../../../karma/fixture';

describe('My Stories View integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await navigateToExploreTemplates(fixture);
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render', () => {
    const viewTemplates = fixture.screen.queryByText('Viewing all templates');

    expect(viewTemplates).toBeTruthy();
  });

  it('should navigate to My Stories', async () => {
    const myStoriesMenuItem = fixture.screen.queryByRole('link', {
      name: /^My Stories$/,
    });

    await fixture.events.click(myStoriesMenuItem);

    const viewStories = fixture.screen.queryByText('Viewing all stories');

    expect(viewStories).toBeTruthy();
  });
});

function navigateToExploreTemplates(fixture) {
  const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
    name: /^Explore Templates$/,
  });

  return fixture.events.click(exploreTemplatesMenuItem);
}
