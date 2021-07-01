/*
 * Copyright 2021 Google LLC
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
 * Custom propTypes validator used to check if either `label`
 * or `aria-label` have been passed to the component.
 * This also checks that they are of the correct type.
 *
 * @param {Object} props the props supplied to the component.
 * @param {string} _ the name of the prop.
 * @param {string} componentName the name of the component.
 * @return {Error|null} Returns an error if the conditions have not been met.
 * Otherwise, returns null.
 */
function labelAccessibilityValidator(props, _, componentName) {
  if (!props.label && !props['aria-label']) {
    return new Error(
      `\`label\` or \`aria-label\` must be supplied to \`${componentName}\`. Validation failed.`
    );
  }

  if (props.label && typeof props.label !== 'string') {
    return new Error(
      `Invalid prop \`label\` of type \`${typeof props.label}\` supplied to \`${componentName}\`, expected \`string\`.`
    );
  }

  if (props['aria-label'] && typeof props['aria-label'] !== 'string') {
    return new Error(
      `Invalid prop \`aria-label\` of type \`${typeof props[
        'aria-label'
      ]}\` supplied to \`${componentName}\`, expected \`string\`.`
    );
  }

  return null;
}

export default labelAccessibilityValidator;
