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
// import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../../karma/fixture';
// import MediaElement from '../panes/media/common/mediaElement';
// import { ProviderType } from '../panes/media/common/providerType';
// import { renderWithTheme } from '../../../testUtils';

// function renderMediaElement(resource, providerType) {
//   const { getByRole, getByTestId } = renderWithTheme(
//     <MediaElement
//       resource={resource}
//       onInsert={() => {}}
//       providerType={providerType}
//     />
//   );
//   return { getByRole, getByTestId };
// }

describe('MediaElement', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it("should render dropdown menu's more icon for uploaded image", () => {
    const firstElement = fixture.querySelectorAll(
      '[data-testid=mediaElement]'
    )[0];

    // console.warn(firstElement);

    firstElement.dispatchEvent(new window.MouseEvent('pointerenter'));

    expect(fixture.querySelectorAll('[data-testid=dropDownMenu]').length).toBe(
      1
    );
    expect(fixture.querySelectorAll('button[name=more]').length).toBe(1);
  });

  //a it("should render dropdown menu's more icon for uploaded video", () => {
  //   const resource = {
  //     id: 456,
  //     src: 'http://video-url.com',
  //     type: 'video',
  //     width: 100,
  //     height: 100,
  //     local: false, // Already uploaded
  //     alt: 'video :)',
  //   };

  //   const { getByRole, getByTestId } = renderMediaElement(
  //     resource,
  //     ProviderType.LOCAL
  //   );

  //   const element = getByTestId('mediaElement');
  //   //   // fireEvent.pointerEnter(element);
  //   fireEvent(element, new window.MouseEvent('pointerenter', {}));
  //   //   fireEvent.mouseEnter(element);

  //   expect(
  //     getByRole('button', { name: /more/i, hidden: true })
  //   ).toBeInTheDocument();
  // });

  //a it("should not render dropdown menu's more icon for not uploaded image", () => {
  //   const resource = {
  //     id: 123,
  //     src: 'http://image-url.com',
  //     type: 'image',
  //     width: 100,
  //     height: 100,
  //     local: true, // Not yet uploaded
  //     alt: 'image :)',
  //   };

  //   const { getByRole, getByTestId } = renderMediaElement(
  //     resource,
  //     ProviderType.LOCAL
  //   );

  //   const element = getByTestId('mediaElement');
  //   // fireEvent.pointerEnter(element);
  //   fireEvent.mouseEnter(element);

  //   expect(getByRole('button', { name: /more/i })).not.toBeInTheDocument();
  // });

  //a it("should not render dropdown menu's more icon for not uploaded video", () => {
  //   const resource = {
  //     id: 456,
  //     src: 'http://video-url.com',
  //     type: 'video',
  //     width: 100,
  //     height: 100,
  //     local: true, // Not yet uploaded
  //     alt: 'video :)',
  //   };

  //   const { getByRole, getByTestId } = renderMediaElement(
  //     resource,
  //     ProviderType.LOCAL
  //   );

  //   const element = getByTestId('mediaElement');
  //   // fireEvent.pointerEnter(element);
  //   fireEvent.mouseEnter(element);

  //   expect(getByRole('button', { name: /more/i })).not.toBeInTheDocument();
  // });
});
