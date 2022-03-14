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
import { __ } from '@googleforcreators/i18n';
import { useRef, useEffect, useCallback } from '@googleforcreators/react';
import styled from 'styled-components';
import { ThemeGlobals } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStoryTriggerListener, STORY_EVENTS } from '../../app/story';
import { Z_INDEX_FOOTER } from '../../constants/zIndex';
import DirectionAware from '../directionAware';
import { useHelpCenter } from '../../app/helpCenter';
import Popup from '../secondaryPopup';
import Navigator from './navigator';
import Companion from './companion';
import { POPUP_ID, KEYS } from './constants';
import { Toggle } from './toggle';
import { forceFocusCompanion } from './utils';

const Wrapper = styled.div`
  z-index: ${Z_INDEX_FOOTER};
`;

export const HelpCenter = ({ components }) => {
  const ref = useRef(null);
  const { state, actions } = useHelpCenter();

  // Set Focus on the expanded companion
  // whenever it opens
  useEffect(() => {
    if (state.isOpen) {
      forceFocusCompanion();
    }
  }, [state.isOpen]);

  useStoryTriggerListener(
    STORY_EVENTS.onReplaceBackgroundMedia,
    useCallback(() => {
      actions.openToUnreadTip(KEYS.ADD_BACKGROUND_MEDIA);
    }, [actions])
  );

  useStoryTriggerListener(
    STORY_EVENTS.onReplaceForegroundMedia,
    useCallback(() => {
      actions.openToUnreadTip(KEYS.CROP_SELECTED_ELEMENTS);
    }, [actions])
  );

  return (
    <DirectionAware>
      <>
        <ThemeGlobals.Styles />
        <Wrapper ref={ref}>
          <Popup
            popupId={POPUP_ID}
            isOpen={state.isOpen}
            ariaLabel={__('Help Center', 'web-stories')}
          >
            <Navigator
              isOpen={state.isOpen}
              onNext={actions.goToNext}
              onPrev={actions.goToPrev}
              onAllTips={actions.goToMenu}
              onClose={actions.close}
              hasBottomNavigation={state.hasBottomNavigation}
              isNextDisabled={state.isNextDisabled}
              isPrevDisabled={state.isPrevDisabled}
            >
              <Companion
                readTips={state.readTips}
                tipKey={state.navigationFlow[state.navigationIndex]}
                onTipSelect={actions.goToTip}
                isLeftToRightTransition={state.isLeftToRightTransition}
                components={components}
              />
            </Navigator>
          </Popup>
          <Toggle
            isOpen={state.isOpen}
            onClick={actions.toggle}
            notificationCount={state.unreadTipsCount}
            popupId={POPUP_ID}
          />
        </Wrapper>
      </>
    </DirectionAware>
  );
};

HelpCenter.propTypes = {
  components: PropTypes.object,
};
