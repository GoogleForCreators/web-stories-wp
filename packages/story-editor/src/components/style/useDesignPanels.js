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
import { useCallback, useEffect, useMemo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useHandlers from '../../utils/useHandlers';
import updateProperties from './updateProperties';
import getDesignPanelsForSelection from './getDesignPanelsForSelection';

function useDesignPanels() {
  const {
    selectedElementIds,
    selectedElements,
    selectedElementAnimations,
    deleteSelectedElements,
    updateElementsById,
    updateAnimationState,
  } = useStory(
    ({
      state: {
        selectedElementIds,
        selectedElements,
        selectedElementAnimations,
      },
      actions: {
        deleteSelectedElements,
        updateElementsById,
        updateAnimationState,
      },
    }) => {
      return {
        selectedElementIds,
        selectedElements,
        selectedElementAnimations,
        deleteSelectedElements,
        updateElementsById,
        updateAnimationState,
      };
    }
  );

  const panels = useMemo(
    () => getDesignPanelsForSelection(selectedElements),
    [selectedElements]
  );
  const [submitHandlers, registerSubmitHandler] = useHandlers();
  const onSetProperties = useCallback(
    (newPropertiesOrUpdater) => {
      updateElementsById({
        elementIds: selectedElementIds,
        properties: (currentProperties) => {
          const update = updateProperties(
            currentProperties,
            newPropertiesOrUpdater,
            /* commitValues */ true
          );
          return update;
        },
      });
    },
    [selectedElementIds, updateElementsById]
  );

  const createSubmitHandlerForPanel = useCallback(
    (panelId) => (submit) => {
      submitHandlers.forEach((handler) =>
        handler(onSetProperties, panelId, submit)
      );
      return submit;
    },
    [onSetProperties, submitHandlers]
  );

  useEffect(() => {
    const submits = {};
    const handler = (onSetPropertiesArg, panelId, submit) => {
      if (onSetProperties === onSetPropertiesArg) {
        submits[panelId] = submit;
      }
    };
    const unregister = registerSubmitHandler(handler);
    return () => {
      unregister();
      Object.values(submits).forEach((submit) => submit());
    };
  }, [onSetProperties, registerSubmitHandler]);

  return useMemo(
    () => ({
      panels,
      createSubmitHandlerForPanel,
      panelProperties: {
        onSetProperties,
        deleteSelectedElements,
        selectedElements,
        selectedElementAnimations,
        updateAnimationState,
      },
    }),
    [
      panels,
      createSubmitHandlerForPanel,
      onSetProperties,
      deleteSelectedElements,
      selectedElements,
      selectedElementAnimations,
      updateAnimationState,
    ]
  );
}

export default useDesignPanels;
