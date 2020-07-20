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

/* Internal dependencies
 */
/**
 * External dependencies
 */
import { useContext } from 'react';
import { within } from '@testing-library/react';
import Fixture from '../../../../karma/fixture';
import { ApiContext } from '../../../api/apiProvider';
import { TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS } from '../../../../constants';

fdescribe('Explore Templates View integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    await navigateToFirstTemplate();
    debugger;
  });

  afterEach(() => {
    fixture.restore();
  });

  async function navigateToFirstTemplate() {
    const exploreTemplatesMenuItem = fixture.screen.queryByRole('link', {
      name: /^Explore Templates$/,
    });

    await fixture.events.click(exploreTemplatesMenuItem);

    const { templatesOrderById } = await getTemplatesState();

    const firstTemplate = getTemplateElementById(templatesOrderById[0]);

    const utils = within(firstTemplate);

    await fixture.events.hover(firstTemplate);

    const view = utils.getByText(
      new RegExp(`^${TEMPLATES_GALLERY_ITEM_CENTER_ACTION_LABELS.template}$`)
    );

    await fixture.events.click(view);
  }

  function getTemplateElementById(id) {
    const template = fixture.screen.getByTestId(`template-grid-item-${id}`);

    return template;
  }

  async function getTemplatesState() {
    const {
      state: { templates },
    } = await fixture.renderHook(() => useContext(ApiContext));
    return templates;
  }

  fit('should pass this test', () => {
    expect(true).toBeTrue();
  });
});
