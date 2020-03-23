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
  registerSubmitHandler,
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

  const internalSubmit = useCallback(
    (updates) => {
      if (Object.keys(updates).length === 0) {
        return;
      }

      const commitUpdates = updates;
      if (presubmitHandlers.length > 0) {
        selectedElements.forEach((element) => {
          const precommitUpdate = updateProperties(
            element,
            updates[element.id],
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
      }

      console.log('QQQQ: submit: ', updates, commitUpdates);
      onSetProperties((element) => commitUpdates[element.id]);

      // Reset.
      setElementUpdates({});
    },
    [presubmitHandlers, selectedElements, onSetProperties]
  );

  const submit = registerSubmitHandler(
    useCallback(
      (evt) => {
        if (evt) {
          evt.preventDefault();
        }
        internalSubmit(elementUpdates);
      },
      [internalSubmit, elementUpdates]
    )
  );

  const pushUpdate = useCallback(
    (update, submitArg = false) => {
      console.log('QQQQ: pushUpdate: ', update);
      const newUpdates = {};
      setElementUpdates((prevUpdates) => {
        selectedElements.forEach((element) => {
          const prevUpdatedElement = { ...element, ...prevUpdates[element.id] };
          const newUpdate = updateProperties(
            prevUpdatedElement,
            update,
            /* commitValues */ true
          );
          newUpdates[element.id] = { ...prevUpdates[element.id], ...newUpdate };
        });
        return newUpdates;
      });
      if (submitArg) {
        internalSubmit(newUpdates);
      }
    },
    [selectedElements, internalSubmit]
  );

  const pushUpdateForObject = useCallback(
    (propertyName, update, defaultObject, submitArg = false) => {
      console.log(
        'QQQQ: pushUpdateForObject: ',
        propertyName,
        update,
        defaultObject,
        submitArg
      );
      pushUpdate((prevUpdatedElement) => {
        const prevObject = prevUpdatedElement[propertyName] || defaultObject;
        return {
          [propertyName]: {
            ...prevObject,
            ...updateProperties(prevObject, update, /* commitValues */ true),
          },
        };
      }, submitArg);
    },
    [pushUpdate]
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
          pushUpdateForObject={pushUpdateForObject}
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
  registerSubmitHandler: PropTypes.func.isRequired,
};

export default DesignPanel;
