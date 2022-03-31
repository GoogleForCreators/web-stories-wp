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
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { useMemo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import useHandlers from '../../../../utils/useHandlers';
import FormContext from '../../../form/context';
import updateProperties from '../../../design/updateProperties';

function TestPanel({
  panelType,
  selectedElements,
  setPresubmitHandlers,
  wrapperComp,
  ...rest
}) {
  const [presubmitHandlers, registerPresubmitHandler] = useHandlers();
  setPresubmitHandlers(presubmitHandlers);
  const formContext = useMemo(
    () => ({
      isMultiple: selectedElements.length > 1,
      registerPresubmitHandler,
    }),
    [selectedElements, registerPresubmitHandler]
  );

  const Panel = panelType;
  const panel = (
    <FormContext.Provider value={formContext}>
      <Panel
        selectedElements={selectedElements}
        submittedSelectedElements={selectedElements}
        {...rest}
      />
    </FormContext.Provider>
  );
  const Wrapper = wrapperComp;
  if (Wrapper) {
    return <Wrapper selectedElements={selectedElements}>{panel}</Wrapper>;
  }
  return panel;
}

TestPanel.propTypes = {
  panelType: PropTypes.func.isRequired,
  selectedElements: PropTypes.array.isRequired,
  setPresubmitHandlers: PropTypes.func.isRequired,
  wrapperComp: PropTypes.func,
};

/**
 * @param {Function} panelType The panel component function.
 * @param {Array<Object>} selectedElements The array of the selected elements.
 * @param {Function} [wrapperComp] An optional wrapper component.
 * @return {Object} The result of rendering. Includes `pushUpdate`, `pushUpdateForObject`, and `submit` callbacks.
 */
export function renderPanel(panelType, selectedElements, wrapperComp) {
  const pushUpdate = jest.fn();
  const pushUpdateForObject = jest.fn();

  let presubmitHandlers = [];
  const setPresubmitHandlers = (handlers) => {
    presubmitHandlers = handlers;
  };

  const submit = (updates) => {
    const commitUpdates = {};
    selectedElements.forEach((element) => {
      const precommitUpdate = updateProperties(
        element,
        updates,
        /* commitValues */ true
      );
      let commitUpdate = precommitUpdate;
      presubmitHandlers.forEach((handler) => {
        const handlerUpdate = handler(
          { ...element, ...commitUpdate },
          precommitUpdate,
          element
        );
        commitUpdate = { ...commitUpdate, ...handlerUpdate };
      });
      commitUpdates[element.id] = commitUpdate;
    });
    return commitUpdates;
  };

  const view = render(
    <ThemeProvider theme={theme}>
      <TestPanel
        panelType={panelType}
        wrapperComp={wrapperComp}
        selectedElements={selectedElements}
        pushUpdate={pushUpdate}
        pushUpdateForObject={pushUpdateForObject}
        setPresubmitHandlers={setPresubmitHandlers}
      />
    </ThemeProvider>
  );
  return {
    ...view,
    pushUpdate,
    pushUpdateForObject,
    submit,
  };
}
