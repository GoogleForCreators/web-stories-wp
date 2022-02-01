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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Alignment from '../alignment';
import { renderPanel } from '../../../shared/test/_utils';

jest.mock('@googleforcreators/element-library');

describe('Panels/Alignment', () => {
  let defaultElement, defaultText, defaultImage;
  const horizontalDistributionButtonLabel = 'Distribute horizontally';
  const verticalDistributionButtonLabel = 'Distribute vertically';
  const justifyLeftButtonLabel = 'Align left';
  const justifyCenterButtonLabel = 'Align center';
  const justifyRightButtonLabel = 'Align right';
  const justifyTopButtonLabel = 'Align top';
  const justifyMiddleButtonLabel = 'Align vertical center';
  const justifyBottomButtonLabel = 'Align bottom';

  beforeEach(() => {
    defaultElement = {
      id: '1',
      isBackground: false,
      x: 10,
      y: 10,
      width: 100,
      height: 80,
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
  });

  function arrange(...args) {
    const view = renderPanel(Alignment, ...args);
    const horizontalDistributionButton = screen.getByLabelText(
      horizontalDistributionButtonLabel
    );
    const verticalDistributionButton = screen.getByLabelText(
      verticalDistributionButtonLabel
    );
    const justifyLeftButton = screen.getByLabelText(justifyLeftButtonLabel);
    const justifyCenterButton = screen.getByLabelText(justifyCenterButtonLabel);
    const justifyRightButton = screen.getByLabelText(justifyRightButtonLabel);
    const justifyTopButton = screen.getByLabelText(justifyTopButtonLabel);
    const justifyMiddleButton = screen.getByLabelText(justifyMiddleButtonLabel);
    const justifyBottomButton = screen.getByLabelText(justifyBottomButtonLabel);

    return {
      ...view,
      horizontalDistributionButton,
      verticalDistributionButton,
      justifyLeftButton,
      justifyCenterButton,
      justifyRightButton,
      justifyTopButton,
      justifyMiddleButton,
      justifyBottomButton,
    };
  }

  describe('single selection', () => {
    it('should render disabled distribution buttons', () => {
      const {
        pushUpdate,
        horizontalDistributionButton,
        verticalDistributionButton,
      } = arrange([defaultElement]);

      expect(horizontalDistributionButton).toBeDisabled();
      expect(verticalDistributionButton).toBeDisabled();

      fireEvent.click(horizontalDistributionButton);
      expect(pushUpdate).toHaveBeenCalledTimes(0);

      fireEvent.click(verticalDistributionButton);
      expect(pushUpdate).toHaveBeenCalledTimes(0);
    });

    it('should render align and justify buttons for default element', () => {
      const {
        justifyLeftButton,
        justifyCenterButton,
        justifyRightButton,
        justifyTopButton,
        justifyMiddleButton,
        justifyBottomButton,
      } = arrange([defaultElement]);

      expect(justifyLeftButton).toBeEnabled();
      expect(justifyCenterButton).toBeEnabled();
      expect(justifyRightButton).toBeEnabled();
      expect(justifyTopButton).toBeEnabled();
      expect(justifyMiddleButton).toBeEnabled();
      expect(justifyBottomButton).toBeEnabled();
    });

    it('should update element on alignleft button click', () => {
      const { justifyLeftButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyLeftButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on alignright button click', () => {
      const { justifyRightButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyRightButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on aligncenter button click', () => {
      const { justifyCenterButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyCenterButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifytop button click', () => {
      const { justifyTopButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyTopButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifybottom button click', () => {
      const { justifyBottomButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyBottomButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });

    it('should update element on justifymiddle button click', () => {
      const { justifyMiddleButton, pushUpdate } = arrange([defaultElement]);

      fireEvent.click(justifyMiddleButton);
      expect(pushUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('2 element selection', () => {
    it('should render disabled distribution and enabled align and justify buttons for multi default element', () => {
      const {
        horizontalDistributionButton,
        verticalDistributionButton,
        justifyLeftButton,
        justifyCenterButton,
        justifyRightButton,
        justifyTopButton,
        justifyMiddleButton,
        justifyBottomButton,
      } = arrange([defaultElement, defaultText]);

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
      const {
        horizontalDistributionButton,
        verticalDistributionButton,
        justifyLeftButton,
        justifyCenterButton,
        justifyRightButton,
        justifyTopButton,
        justifyMiddleButton,
        justifyBottomButton,
      } = arrange([defaultElement, defaultText, defaultImage]);

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
