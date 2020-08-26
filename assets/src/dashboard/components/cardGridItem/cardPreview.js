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
import { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Button } from '..';
import { STORY_ANIMATION_STATE } from '../../../animation';
import { resolveRoute } from '../../app/router';
import {
  BUTTON_TYPES,
  DEFAULT_STORY_PAGE_ADVANCE_DURATION,
} from '../../constants';
import { PageSizePropType, StoryPropType } from '../../types';
import { clamp, useFocusOut } from '../../utils';
import PreviewErrorBoundary from '../previewErrorBoundary';
import PreviewPage from '../previewPage';
import { ActionLabel } from './types';

const PreviewPane = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.storyPreview.borderRadius}px;
  height: ${({ cardSize }) => `${cardSize.containerHeight}px`};
  box-shadow: ${({ theme }) => theme.storyPreview.shadow};
  border: ${({ theme }) => theme.storyPreview.border};
  width: 100%;
  overflow: hidden;
  z-index: -1;
`;
PreviewPane.propTypes = {
  cardSize: PageSizePropType.isRequired,
};

const EditControls = styled.div`
  height: ${({ cardSize }) => `${cardSize.containerHeight}px`};
  width: ${({ cardSize }) => `${cardSize.width}px`};
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  transition: opacity ease-in-out 300ms;
  background: ${({ theme }) => theme.cardItem.previewOverlay};
  border-radius: ${({ theme }) => theme.storyPreview.borderRadius}px;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    button,
    a {
      min-width: ${({ cardSize }) => cardSize.width};
      & > label {
        font-size: 12px;
      }
    }
  }
`;
EditControls.propTypes = {
  cardSize: PageSizePropType.isRequired,
};

const ActionContainer = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
`;

const EmptyActionContainer = styled(ActionContainer)`
  padding: 40px;
`;

const getActionAttributes = (targetAction) =>
  typeof targetAction === 'string'
    ? { href: resolveRoute(targetAction), isLink: true }
    : { onClick: targetAction };

const CARD_STATE = {
  IDLE: 'idle',
  ACTIVE: 'active',
};

const CARD_ACTION = {
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
};

const cardMachine = {
  [CARD_STATE.IDLE]: {
    [CARD_ACTION.ACTIVATE]: CARD_STATE.ACTIVE,
  },
  [CARD_STATE.ACTIVE]: {
    [CARD_ACTION.DEACTIVATE]: CARD_STATE.IDLE,
  },
};

const cardReducer = (state, action) => cardMachine?.[state]?.[action] || state;

const CardPreviewContainer = ({
  centerAction,
  bottomAction,
  story,
  pageSize,
  children,
  containerAction = () => {},
}) => {
  const [cardState, dispatch] = useReducer(cardReducer, CARD_STATE.IDLE);
  const [pageIndex, setPageIndex] = useState(0);
  const containElem = useRef(null);
  const storyPages = story?.pages || [];

  useFocusOut(containElem, () => dispatch(CARD_ACTION.DEACTIVATE), []);

  useEffect(() => {
    if (CARD_STATE.IDLE === cardState) {
      setPageIndex(0);
    }
  }, [cardState]);

  useEffect(() => {
    let intervalId;
    if (CARD_STATE.ACTIVE === cardState) {
      /**
       * The interval duration should eventually get pulled off the story schema's
       * auto advance duration and if no duration provided, use a default.
       *
       * Can also incorporate onWAAPIFinish here to make sure the page
       * doesn't switch before the animations finishes.
       */
      intervalId = setInterval(
        () => setPageIndex((v) => clamp(v + 1, [0, storyPages.length - 1])),
        DEFAULT_STORY_PAGE_ADVANCE_DURATION
      );
    }

    return () => intervalId && clearInterval(intervalId);
  }, [storyPages.length, cardState]);

  const handleKeyDownEditControls = useCallback(
    ({ key }) => {
      if (key === 'Enter') {
        containerAction();
      }
    },
    [containerAction]
  );
  return (
    <>
      <PreviewPane cardSize={pageSize}>
        <PreviewErrorBoundary>
          <PreviewPage
            pageSize={pageSize}
            page={storyPages[pageIndex]}
            animationState={
              CARD_STATE.ACTIVE === cardState
                ? STORY_ANIMATION_STATE.PLAYING
                : STORY_ANIMATION_STATE.RESET
            }
          />
        </PreviewErrorBoundary>
        {children}
      </PreviewPane>
      <EditControls
        data-testid="card-action-container"
        ref={containElem}
        cardSize={pageSize}
        isActive={CARD_STATE.ACTIVE === cardState}
        onFocus={() => dispatch(CARD_ACTION.ACTIVATE)}
        onMouseEnter={() => dispatch(CARD_ACTION.ACTIVATE)}
        onMouseLeave={() => dispatch(CARD_ACTION.DEACTIVATE)}
        onClick={containerAction}
        onKeyDown={handleKeyDownEditControls}
        tabIndex={0}
      >
        <EmptyActionContainer />
        {centerAction?.label && (
          <ActionContainer>
            <Button
              data-testid="card-center-action"
              type={BUTTON_TYPES.SECONDARY}
              {...getActionAttributes(centerAction.targetAction)}
            >
              {centerAction.label}
            </Button>
          </ActionContainer>
        )}
        <ActionContainer>
          <Button {...getActionAttributes(bottomAction.targetAction)}>
            {bottomAction.label}
          </Button>
        </ActionContainer>
      </EditControls>
    </>
  );
};

const ActionButtonPropType = PropTypes.shape({
  targetAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  label: ActionLabel,
});

CardPreviewContainer.propTypes = {
  children: PropTypes.node,
  centerAction: ActionButtonPropType,
  bottomAction: ActionButtonPropType.isRequired,
  containerAction: PropTypes.func,
  pageSize: PageSizePropType.isRequired,
  story: StoryPropType,
};

export default CardPreviewContainer;
