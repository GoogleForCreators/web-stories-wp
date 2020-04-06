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
import BackgroundDisplayPanel from '../backgroundDisplay';
import { renderPanel } from './_utils';

function setupPanel(isFullbleedBackground = undefined) {
  const selectedElements = [{ isFullbleedBackground }];
  const { getByText, pushUpdate } = renderPanel(
    BackgroundDisplayPanel,
    selectedElements
  );

  const onLabelEl = getByText('Fit to device');
  const offLabelEl = getByText('Do not format');

  return {
    enable: () => fireEvent.click(onLabelEl),
    disable: () => fireEvent.click(offLabelEl),
    pushUpdate,
  };
}

describe('BackgroundDisplayPanel', () => {
  it('should disable fullbleed', () => {
    const { disable, pushUpdate } = setupPanel(true);

    disable();

    expect(pushUpdate).toHaveBeenCalledWith(
      {
        isFullbleedBackground: false,
      },
      true
    );
  });

  it('should enable fullbleed', () => {
    const { enable, pushUpdate } = setupPanel(false);

    enable();

    expect(pushUpdate).toHaveBeenCalledWith(
      {
        isFullbleedBackground: true,
      },
      true
    );
  });
});
