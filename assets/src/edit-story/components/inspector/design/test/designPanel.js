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
import { render, act, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE } from '../../../../constants';
import useFormContext from '../../../form/useFormContext';
import { usePresubmitHandler } from '../../../form';
import DesignPanel from '../designPanel';

describe('DesignPanel', () => {
  let element1, element2;
  let presubmitHandler1, presubmitHandler2;
  let registerSubmitHandler;
  let submitHandler;
  let onSetProperties;
  let formContext;
  let lastProps;

  beforeEach(() => {
    element1 = {
      id: '1',
      type: 'image',
      x: 11,
      y: 12,
      width: 111,
      height: 121,
      rotationAngle: 0,
      z: 17,
    };
    element2 = {
      id: '2',
      type: 'text',
      x: 111,
      y: 112,
      width: 211,
      height: 221,
      rotationAngle: 1,
    };
    onSetProperties = jest.fn();
    formContext = null;
    presubmitHandler1 = jest.fn(({ x }) => ({ x: x + 1 }));
    presubmitHandler2 = jest.fn(({ y }) => ({ y: y + 1 }));
    registerSubmitHandler = (handler) => {
      submitHandler = handler;
      return handler;
    };
  });

  function CustomPanel(props) {
    lastProps = { ...props };
    formContext = useFormContext();
    usePresubmitHandler(presubmitHandler1, []);
    usePresubmitHandler(presubmitHandler2, []);
    return <div />;
  }

  describe('single element', () => {
    let selectedElements;
    let form;

    beforeEach(() => {
      selectedElements = [element1];
      const { container } = render(
        <DesignPanel
          panelType={CustomPanel}
          selectedElements={selectedElements}
          onSetProperties={onSetProperties}
          registerSubmitHandler={registerSubmitHandler}
        />
      );
      form = container.firstElementChild;
    });

    it('should configure form context', () => {
      expect(formContext.isMultiple).toBe(false);
      expect(typeof formContext.registerPresubmitHandler === 'function').toBe(
        true
      );
    });

    it('should push and accumulate updates', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE, z: '' }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
        z: '',
      });

      // Second update.
      act(() => pushUpdate({ x: 12, y: 14 }));
      const {
        selectedElements: [updatedElementB],
      } = lastProps;
      expect(updatedElementB).toStrictEqual({
        ...element1,
        x: 12,
        y: 14,
        z: '',
      });

      const any = expect.anything();
      expect(presubmitHandler1).not.toHaveBeenCalledWith(any, any, any);
      expect(presubmitHandler2).not.toHaveBeenCalledWith(any, any, any);
      expect(onSetProperties).not.toHaveBeenCalledWith(any);
    });

    it('should submit updates and run presubmits', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE, z: '' }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
        z: '',
      });

      // Submit.
      fireEvent.submit(form);

      const any = expect.anything();
      expect(presubmitHandler1).toHaveBeenCalledWith(any, any, any);
      expect(presubmitHandler2).toHaveBeenCalledWith(any, any, any);

      const presubmitArgs = presubmitHandler1.mock.calls[0];
      // Based on: presubmit(newElement, update, oldElement).
      expect(presubmitArgs[0]).toStrictEqual({
        ...element1,
        x: 12,
      });
      expect(presubmitArgs[1]).toStrictEqual({
        x: 12,
      });
      expect(presubmitArgs[2]).toStrictEqual(element1);

      expect(onSetProperties).toHaveBeenCalledWith(any);
      const func = onSetProperties.mock.calls[0][0];
      expect(func(element1)).toStrictEqual({
        x: 12 + 1,
        y: element1.y + 1,
      });
    });

    it('should submit updates and run presubmits on exit', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
      });

      // Submit on exit.
      act(() => submitHandler());
      const any = expect.anything();
      expect(presubmitHandler1).toHaveBeenCalledWith(any, any, any);
      expect(presubmitHandler2).toHaveBeenCalledWith(any, any, any);
      expect(onSetProperties).toHaveBeenCalledWith(any);
      const func = onSetProperties.mock.calls[0][0];
      expect(func(element1)).toStrictEqual({
        x: 12 + 1,
        y: element1.y + 1,
      });
    });
  });

  describe('multiple elements', () => {
    let selectedElements;
    let form;

    beforeEach(() => {
      selectedElements = [element1, element2];
      const { container } = render(
        <DesignPanel
          panelType={CustomPanel}
          selectedElements={selectedElements}
          onSetProperties={onSetProperties}
          registerSubmitHandler={registerSubmitHandler}
        />
      );
      form = container.firstElementChild;
    });

    it('should configure form context', () => {
      expect(formContext.isMultiple).toBe(true);
    });

    it('should push updates to all elements', () => {
      const { pushUpdate } = lastProps;

      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElement1, updatedElement2],
      } = lastProps;
      expect(updatedElement1).toStrictEqual({
        ...element1,
        x: 12,
      });
      expect(updatedElement2).toStrictEqual({
        ...element2,
        x: 12,
      });
    });

    it('should submit updates and run presubmits', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
      });

      // Submit.
      fireEvent.submit(form);
      expect(presubmitHandler1).toHaveBeenCalledTimes(2);
      expect(presubmitHandler2).toHaveBeenCalledTimes(2);
      expect(onSetProperties).toHaveBeenCalledTimes(1);
      const func = onSetProperties.mock.calls[0][0];
      expect(func(element1)).toStrictEqual({
        x: 12 + 1,
        y: element1.y + 1,
      });
      expect(func(element2)).toStrictEqual({
        x: 12 + 1,
        y: element2.y + 1,
      });
    });
  });
});
