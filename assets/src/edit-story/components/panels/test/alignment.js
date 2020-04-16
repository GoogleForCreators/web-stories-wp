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
import Alignment from '../alignment';
import { renderPanel } from './_utils';

jest.mock('../../../elements');

describe('Panels/Alignment', () => {
  let defaultElement, defaultText, defaultImage, fillElement;
  const horizontalDistributionButtonLabel = 'Horizontal Distribution';
  const verticalDistributionButtonLabel = 'Vertical Distribution';
  const justifyLeftButtonLabel = 'Justify Left';
  const justifyCenterButtonLabel = 'Justify Center';
  const justifyRightButtonLabel = 'Justify Right';
  const justifyTopButtonLabel = 'Justify Top';
  const justifyMiddleButtonLabel = 'Justify Middle';
  const justifyBottomButtonLabel = 'Justify Bottom';

  beforeEach(() => {
    defaultElement = {
      id: '1',
      isBackground: false,
      x: 10,
      y: 10,
      width: 100,
      height: 80,
      isFill: false,
      rotationAngle: 0,
    };
    defaultText = {
      ...defaultElement,
      type: 'text',
    };
    defaultImage = {
      ...defaultElement,
      type: 'image',
    };
    fillElement = {
      ...defaultElement,
      isFill: true,
    };
  });

  function renderAlignment(...args) {
    return renderPanel(Alignment, ...args);
  }

  it('should render <Alignment /> panel', () => {
    const { getByLabelText } = renderAlignment([defaultElement]);
    const element = getByLabelText('Alignment Panel');
    expect(element).toBeDefined();
  });

  describe('single selection', () => {
    it('should render disabled distribution buttons', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const horizontalDistributionButton = getByLabelText(
        horizontalDistributionButtonLabel
      );
      const verticalDistributionButton = getByLabelText(
        verticalDistributionButtonLabel
      );
      expect(horizontalDistributionButton).toBeDisabled();
      expect(verticalDistributionButton).toBeDisabled();

      fireEvent.click(horizontalDistributionButton);
      expect(pushUpdate).toHaveBeenCalledTimes(0);

      fireEvent.click(verticalDistributionButton);
      expect(pushUpdate).toHaveBeenCalledTimes(0);
    });

    it('should render align and justify buttons for default element', () => {
      const { getByLabelText } = renderAlignment([defaultElement]);
      const justifyLeftButton = getByLabelText(justifyLeftButtonLabel);
      const justifyCenterButton = getByLabelText(justifyCenterButtonLabel);
      const justifyRightButton = getByLabelText(justifyRightButtonLabel);
      const justifyTopButton = getByLabelText(justifyTopButtonLabel);
      const justifyMiddleButton = getByLabelText(justifyMiddleButtonLabel);
      const justifyBottomButton = getByLabelText(justifyBottomButtonLabel);
      expect(justifyLeftButton).toBeEnabled();
      expect(justifyCenterButton).toBeEnabled();
      expect(justifyRightButton).toBeEnabled();
      expect(justifyTopButton).toBeEnabled();
      expect(justifyMiddleButton).toBeEnabled();
      expect(justifyBottomButton).toBeEnabled();
    });

    it('should render disabled distribution, align and justify buttons for filled element', () => {
      const { getByLabelText } = renderAlignment([fillElement]);
      const horizontalDistributionButton = getByLabelText(
        horizontalDistributionButtonLabel
      );
      const verticalDistributionButton = getByLabelText(
        verticalDistributionButtonLabel
      );
      const justifyLeftButton = getByLabelText(justifyLeftButtonLabel);
      const justifyCenterButton = getByLabelText(justifyCenterButtonLabel);
      const justifyRightButton = getByLabelText(justifyRightButtonLabel);
      const justifyTopButton = getByLabelText(justifyTopButtonLabel);
      const justifyMiddleButton = getByLabelText(justifyMiddleButtonLabel);
      const justifyBottomButton = getByLabelText(justifyBottomButtonLabel);
      expect(horizontalDistributionButton).toBeDisabled();
      expect(verticalDistributionButton).toBeDisabled();
      expect(justifyLeftButton).toBeDisabled();
      expect(justifyCenterButton).toBeDisabled();
      expect(justifyRightButton).toBeDisabled();
      expect(justifyTopButton).toBeDisabled();
      expect(justifyMiddleButton).toBeDisabled();
      expect(justifyBottomButton).toBeDisabled();
    });

    it('should update element on alignleft button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyLeftButton = getByLabelText(justifyLeftButtonLabel);

      fireEvent.click(justifyLeftButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on alignright button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyRightButton = getByLabelText(justifyRightButtonLabel);

      fireEvent.click(justifyRightButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on aligncenter button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyCenterButton = getByLabelText(justifyCenterButtonLabel);

      fireEvent.click(justifyCenterButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifytop button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyTopButton = getByLabelText(justifyTopButtonLabel);

      fireEvent.click(justifyTopButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifybottom button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyBottomButton = getByLabelText(justifyBottomButtonLabel);

      fireEvent.click(justifyBottomButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifymiddle button click', () => {
      const { getByLabelText, pushUpdate } = renderAlignment([defaultElement]);
      const justifyMiddleButton = getByLabelText(justifyMiddleButtonLabel);

      fireEvent.click(justifyMiddleButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('2 element selection', () => {
    it('should render disabled distribution and enabled align and justify buttons for multi default element', () => {
      const { getByLabelText } = renderAlignment([defaultElement, defaultText]);
      const horizontalDistributionButton = getByLabelText(
        horizontalDistributionButtonLabel
      );
      const verticalDistributionButton = getByLabelText(
        verticalDistributionButtonLabel
      );
      const justifyLeftButton = getByLabelText(justifyLeftButtonLabel);
      const justifyCenterButton = getByLabelText(justifyCenterButtonLabel);
      const justifyRightButton = getByLabelText(justifyRightButtonLabel);
      const justifyTopButton = getByLabelText(justifyTopButtonLabel);
      const justifyMiddleButton = getByLabelText(justifyMiddleButtonLabel);
      const justifyBottomButton = getByLabelText(justifyBottomButtonLabel);
      expect(horizontalDistributionButton).toBeDisabled();
      expect(verticalDistributionButton).toBeDisabled();
      expect(justifyLeftButton).toBeEnabled();
      expect(justifyCenterButton).toBeEnabled();
      expect(justifyRightButton).toBeEnabled();
      expect(justifyTopButton).toBeEnabled();
      expect(justifyMiddleButton).toBeEnabled();
      expect(justifyBottomButton).toBeEnabled();
    });
  });

  describe('3 element selection', () => {
    it('should render enabled distribution, align and justify buttons for multi default element', () => {
      const { getByLabelText } = renderAlignment([
        defaultElement,
        defaultText,
        defaultImage,
      ]);
      const horizontalDistributionButton = getByLabelText(
        horizontalDistributionButtonLabel
      );
      const verticalDistributionButton = getByLabelText(
        verticalDistributionButtonLabel
      );
      const justifyLeftButton = getByLabelText(justifyLeftButtonLabel);
      const justifyCenterButton = getByLabelText(justifyCenterButtonLabel);
      const justifyRightButton = getByLabelText(justifyRightButtonLabel);
      const justifyTopButton = getByLabelText(justifyTopButtonLabel);
      const justifyMiddleButton = getByLabelText(justifyMiddleButtonLabel);
      const justifyBottomButton = getByLabelText(justifyBottomButtonLabel);
      expect(horizontalDistributionButton).toBeEnabled();
      expect(verticalDistributionButton).toBeEnabled();
      expect(justifyLeftButton).toBeEnabled();
      expect(justifyCenterButton).toBeEnabled();
      expect(justifyRightButton).toBeEnabled();
      expect(justifyTopButton).toBeEnabled();
      expect(justifyMiddleButton).toBeEnabled();
      expect(justifyBottomButton).toBeEnabled();
    });
  });
});
