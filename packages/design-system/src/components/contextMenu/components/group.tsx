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
 * External dependencies
 */
import PropTypes from 'prop-types';
/**
 * A wrapping div with `role="group"` for use in the context menu.
 *
 * @param {Object} props Attributes to pass to the div.
 * @param {string} props.label Accessible label for the group.
 * @return {Node} The react node
 */
function Group({ label, ...props }) {
  return <div role="group" aria-label={label} {...props} />;
}
Group.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Group;
