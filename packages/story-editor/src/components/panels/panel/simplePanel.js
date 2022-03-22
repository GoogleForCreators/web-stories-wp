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

/**
 * Internal dependencies
 */
import Panel from './panel';
import PanelTitle from './shared/title';
import PanelContent from './shared/content';

function SimplePanel({ children, name, ariaLabel, title, className, ...rest }) {
  return (
    <Panel name={name} {...rest}>
      <PanelTitle
        ariaLabel={ariaLabel ?? (typeof title === 'string' ? title : '')}
        {...rest}
      >
        {title}
      </PanelTitle>
      <PanelContent className={className}>{children}</PanelContent>
    </Panel>
  );
}

SimplePanel.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default SimplePanel;
