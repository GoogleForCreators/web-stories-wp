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
import { TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import { memo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { Menu } from '../menu';
import { QuickTip } from '../quickTip';
import { DONE_TIP_ENTRY } from '../constants';
import { useHelpCenter } from '../../../app';

function Companion({
  tipKey,
  onTipSelect,
  isLeftToRightTransition,
  readTips,
  components,
}) {
  const {
    state: { tips },
  } = useHelpCenter();
  const TIP_MAP = { ...tips, [DONE_TIP_ENTRY[0]]: DONE_TIP_ENTRY[1] };
  const tip = tipKey && TIP_MAP[tipKey];

  return (
    <TransitionGroup>
      {tip ? (
        <QuickTip
          key={tipKey}
          isDone={tipKey === DONE_TIP_ENTRY[0]}
          transitionKey={tipKey}
          isLeftToRightTransition={isLeftToRightTransition}
          {...tip}
        />
      ) : (
        <Menu
          key="menu"
          readTips={readTips}
          onTipSelect={onTipSelect}
          components={components}
        />
      )}
    </TransitionGroup>
  );
}

Companion.propTypes = {
  readTips: PropTypes.object,
  tipKey: PropTypes.string,
  onTipSelect: PropTypes.func.isRequired,
  isLeftToRightTransition: PropTypes.bool.isRequired,
  components: PropTypes.object,
};

export default memo(Companion);
