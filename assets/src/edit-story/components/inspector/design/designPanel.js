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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import FormContext from '../../form/context';
import useHandlers from '../../../utils/useHandlers';
import updateProperties from './updateProperties';

const Form = styled.form`
  padding: 0;
  margin: 0;
`;

const AutoSubmitButton = styled.input.attrs({ type: 'submit' })`
  display: none;
`;

function DesignPanel({
  panelType,
  selectedElements,
  onSetProperties,
  ...rest
}) {
  const [presubmitHandlers, registerPresubmitHandler] = useHandlers();

  const formContext = useMemo(
    () => ({
      isMultiple: selectedElements.length > 1,
      registerPresubmitHandler,
    }),
    [selectedElements, registerPresubmitHandler]
  );

  const [elementUpdates, setElementUpdates] = useState({});

  const updatedElements = useMemo(() => {
    return selectedElements.map((element) => ({
      ...element,
      ...elementUpdates[element.id],
    }));
  }, [selectedElements, elementUpdates]);

  const submit = useCallback(
    (evt) => {
      if (evt) {
        evt.preventDefault();
      }
      if (Object.keys(elementUpdates).length > 0) {
        const commitUpdates = elementUpdates;
        if (presubmitHandlers.length > 0) {
          selectedElements.forEach((element) => {
            const precommitUpdate = updateProperties(
              element,
              elementUpdates[element.id],
              /* commitValues */ true
            );
            let commitUpdate = precommitUpdate;
            presubmitHandlers.forEach((handler) => {
              const handlerUpdate = handler({ ...element, ...commitUpdate });
              commitUpdate = { ...commitUpdate, ...handlerUpdate };
            });
            commitUpdates[element.id] = commitUpdate;
          });
        }

        onSetProperties((element) => commitUpdates[element.id]);
        // Reset.
        setElementUpdates({});
      }
    },
    [presubmitHandlers, selectedElements, elementUpdates, onSetProperties]
  );

  const pushUpdate = useCallback(
    (update, submitArg = false) => {
      setElementUpdates((prevUpdates) => {
        const newUpdates = {};
        selectedElements.forEach((element) => {
          const prevUpdatedElement = { ...element, ...prevUpdates[element.id] };
          const newUpdate = updateProperties(
            prevUpdatedElement,
            update,
            /* commitValues */ false
          );
          newUpdates[element.id] = { ...prevUpdates[element.id], ...newUpdate };
        });
        return newUpdates;
      });
      if (submitArg) {
        submit();
      }
    },
    [selectedElements, submit]
  );

  const Panel = panelType;
  return (
    <Form onSubmit={submit}>
      <AutoSubmitButton />
      <FormContext.Provider value={formContext}>
        <Panel
          selectedElements={updatedElements}
          onSetProperties={onSetProperties}
          pushUpdate={pushUpdate}
          submit={submit}
          {...rest}
        />
      </FormContext.Provider>
    </Form>
  );
}

DesignPanel.propTypes = {
  panelType: PropTypes.func.isRequired,
  selectedElements: PropTypes.arrayOf(StoryPropTypes.element).isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default DesignPanel;
