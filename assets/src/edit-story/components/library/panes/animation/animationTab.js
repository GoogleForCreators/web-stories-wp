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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Tab, Icon } from '../shared';
import paneId from './paneId';
import { ReactComponent as AnimationIcon } from './animation.svg';

function AnimationTab(props) {
  return (
    <Tab aria-controls={paneId} {...props}>
      <Icon>
        <AnimationIcon aria-label={__('Animation library', 'web-stories')} />
      </Icon>
    </Tab>
  );
}

export default AnimationTab;
