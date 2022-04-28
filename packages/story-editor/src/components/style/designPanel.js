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
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import FormContext from '../form/context';
import useHandlers from '../../utils/useHandlers';
import updateProperties from './updateProperties';

const Form = styled.form`
  padding: 0;
  margin: 0;
`;

const AutoSubmitButton = styled.input.attrs({ type: 'submit' })`
  display: none;
`;

/**
 * NOTE: data flow for updating elements with pushUpdate documented in `docs/design-panel-push-update-flow.md`
 *
 * @param {any} props Design Panel Props
 * @return {any} React Element
 */
function DesignPanel({
  panelType,
  selectedElements,
  onSetProperties,
  registerSubmitHandler,
  ...rest
}) {
  const formRef = useRef(null);
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

      onSetProperties((element) => commitUpdates[element.id]);
    },
    [presubmitHandlers, selectedElements, onSetProperties]
  );

  const onSubmit = registerSubmitHandler(
    useCallback(
      (evt) => {
        if (evt) {
          evt.preventDefault();
          // Reset.
          setElementUpdates({});
        }
        internalSubmit(elementUpdates);
      },
      [internalSubmit, elementUpdates]
    )
  );

  const submit = useCallback(() => {
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout -- Only depends on the `ref` and thus save from dismount issues.
    setTimeout(() => {
      const form = formRef.current;
      if (form) {
        form.dispatchEvent(
          new window.Event('submit', { cancelable: true, bubbles: true })
        );
      }
    });
  }, []);

  const pushUpdate = useCallback(
    (update, submitArg = false) => {
      setElementUpdates((prevUpdates) => {
        const newUpdates = {};
        selectedElements.forEach((element) => {
          const prevUpdatedElement = { ...element, ...prevUpdates[element.id] };
          const newUpdate = updateProperties(prevUpdatedElement, update, false);
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

  const pushUpdateForObject = useCallback(
    (propertyName, update, defaultObject, submitArg = false) => {
      pushUpdate((prevUpdatedElement) => {
        const prevObject = prevUpdatedElement[propertyName] || defaultObject;
        return {
          [propertyName]: update
            ? {
                ...prevObject,
                ...updateProperties(prevObject, update, false),
              }
            : null,
        };
      }, submitArg);
    },
    [pushUpdate]
  );

  const Panel = panelType;
  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <AutoSubmitButton />
      <FormContext.Provider value={formContext}>
        <Panel
          selectedElements={updatedElements}
          submittedSelectedElements={selectedElements}
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
