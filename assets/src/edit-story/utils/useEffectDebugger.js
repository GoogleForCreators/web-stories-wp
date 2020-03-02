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

/* eslint no-console: 0 */

/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';

const compareInputs = (oldInputs, newInputs, prefix) => {
  // Edge-case: different array lengths
  if (oldInputs.length !== newInputs.length) {
    // Not helpful to compare item by item, so just output the whole array
    console.log(
      `${prefix} - Inputs have a different length`,
      oldInputs,
      newInputs
    );
    console.log('Old inputs:', oldInputs);
    console.log('New inputs:', newInputs);
    return;
  }

  // Compare individual items
  oldInputs.forEach((oldInput, index) => {
    const newInput = newInputs[index];
    if (oldInput !== newInput) {
      console.log(`${prefix} - The input changed in position ${index}`);
      console.log('Old value:', oldInput);
      console.log('New value:', newInput);
    }
  });
};

// Same arguments as useEffect, but with an optional string for logging purposes
const useEffectDebugger = (func, inputs, prefix = 'useEffect') => {
  // Using a ref to hold the inputs from the previous run (or same run for initial run
  const oldInputsRef = useRef(inputs);
  useEffect(() => {
    // Get the old inputs
    const oldInputs = oldInputsRef.current;

    // Compare the old inputs to the current inputs
    compareInputs(oldInputs, inputs, prefix);

    // Save the current inputs
    oldInputsRef.current = inputs;

    // Execute wrapped effect
    func();
  }, [func, inputs, prefix]);
};

export default useEffectDebugger;
