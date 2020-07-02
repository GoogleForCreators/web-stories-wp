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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import VideoAccessibility, { MIN_MAX } from '../videoAccessibility';
import { renderPanel } from './_utils';

jest.mock('../../mediaPicker', () => ({
  useMediaPicker: ({ onSelect }) => {
    const image = { url: 'media1' };
    onSelect(image);
  },
}));

describe('Panels/VideoAccessibility', () => {
  const defaultElement = {
    resource: { posterId: 0, title: '', poster: '', alt: '' },
  };
  function renderVideoAccessibility(...args) {
    return renderPanel(VideoAccessibility, ...args);
  }

  it('should render <VideoAccessibility /> panel', () => {
    const { getByRole } = renderVideoAccessibility([defaultElement]);
    const element = getByRole('button', { name: 'Edit: Video poster' });
    expect(element).toBeDefined();
  });

  it('should simulate a click on <VideoAccessibility />', () => {
    const { getByRole, pushUpdate } = renderVideoAccessibility([
      defaultElement,
    ]);
    const element = getByRole('button', { name: 'Edit: Video poster' });
    fireEvent.click(element);
    expect(pushUpdate).toHaveBeenCalledTimes(1);
    expect(pushUpdate).toHaveBeenCalledWith({ poster: 'media1' }, true);
  });

  it('should trim "alt" to maximum allowed length if exceeding', () => {
    const { getByPlaceholderText, submit } = renderVideoAccessibility([
      defaultElement,
    ]);
    const input = getByPlaceholderText('Assistive text');

    const bigText = ''.padStart(MIN_MAX.ALT_TEXT.MAX + 10, '1');

    fireEvent.change(input, { target: { value: bigText } });
    const submits = submit({
      resource: { posterId: 0, poster: '', alt: bigText },
    });
    expect(submits[defaultElement.id].resource.alt).toHaveLength(
      MIN_MAX.ALT_TEXT.MAX
    );
  });

  it('should trim "title" to maximum allowed length if exceeding', () => {
    const { getByPlaceholderText, submit } = renderVideoAccessibility([
      defaultElement,
    ]);
    const input = getByPlaceholderText('Title');

    const bigText = ''.padStart(MIN_MAX.TITLE.MAX + 10, '1');

    fireEvent.change(input, { target: { value: bigText } });
    const submits = submit({
      resource: { posterId: 0, poster: '', title: bigText },
    });
    expect(submits[defaultElement.id].resource.title).toHaveLength(
      MIN_MAX.TITLE.MAX
    );
  });
});
