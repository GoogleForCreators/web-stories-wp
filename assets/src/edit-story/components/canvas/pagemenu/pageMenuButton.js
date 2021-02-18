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
import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  Tooltip,
} from '../../../../design-system';

function PageMenuButton({ children, title, shortcut, ...rest }) {
  return (
    <Tooltip title={title} shortcut={shortcut} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        {...rest}
      >
        {children}
      </Button>
    </Tooltip>
  );
}

PageMenuButton.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  shortcut: PropTypes.string,
};

export default PageMenuButton;
