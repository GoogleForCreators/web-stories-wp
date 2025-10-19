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
import {
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from '@googleforcreators/react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { TextSize, themeHelpers } from '../../theme';
import { LoadingSpinner } from '../loadingSpinner';
import { Text } from '../typography';

const ScrollMessage = styled.div`
  width: 100%;
  padding: 140px 0 40px;
  margin: -100px auto 0;
  text-align: center;

  p {
    color: ${({ theme }) => theme.colors.fg.tertiary};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AriaOnlyAlert = styled.span`
  ${themeHelpers.visuallyHidden}
`;

enum State {
  Loadable = 'loadable',
  LoadingInternal = 'loading_internal',
  LoadingExternal = 'loading_external',
  Complete = 'complete',
}

enum Action {
  OnInternalLoad = 'internal on load',
  OnExternalLoad = 'external on load',
  OnAllLoaded = 'all loaded',
  OnLoadSuccess = 'load success',
  OnCanLoadMore = 'can load more',
}

const machine: Record<State, Partial<Record<Action, State>>> = {
  [State.Loadable]: {
    [Action.OnInternalLoad]: State.LoadingInternal,
    [Action.OnExternalLoad]: State.LoadingExternal,
  },
  [State.LoadingInternal]: {
    [Action.OnAllLoaded]: State.Complete,
    [Action.OnLoadSuccess]: State.Loadable,
  },
  [State.LoadingExternal]: {
    [Action.OnAllLoaded]: State.Complete,
    [Action.OnLoadSuccess]: State.Loadable,
  },
  [State.Complete]: {
    [Action.OnCanLoadMore]: State.Loadable,
  },
};

const loadReducer = (state: State, action: Action) => {
  return machine[state][action] || state;
};

interface InfiniteScrollProps {
  allDataLoadedMessage?: string;
  allDataLoadedAriaMessage?: string;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  isLoading?: boolean;
  loadingAriaMessage?: string;
  loadingSpinnerProps?: Partial<ComponentProps<typeof LoadingSpinner>>;
}

function InfiniteScroller({
  allDataLoadedMessage,
  allDataLoadedAriaMessage,
  onLoadMore,
  canLoadMore,
  isLoading,
  loadingAriaMessage,
  loadingSpinnerProps = { animationSize: 50, circleSize: 6 },
}: InfiniteScrollProps) {
  const loadingRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);
  // eslint-disable-next-line react-hooks/refs -- FIXME
  onLoadMoreRef.current = onLoadMore;

  const [loadState, dispatch] = useReducer(loadReducer, State.Loadable);

  const loadingAlert = useMemo(() => {
    if (loadState === State.LoadingInternal) {
      return loadingAriaMessage;
    } else if (loadState !== State.LoadingExternal && !canLoadMore) {
      return allDataLoadedAriaMessage;
    }
    return null;
  }, [allDataLoadedAriaMessage, loadingAriaMessage, loadState, canLoadMore]);

  useEffect(() => {
    if (loadState === State.LoadingInternal) {
      onLoadMoreRef.current?.();
    }
  }, [loadState]);

  useEffect(() => {
    if (isLoading) {
      dispatch(Action.OnExternalLoad);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(canLoadMore ? Action.OnLoadSuccess : Action.OnAllLoaded);
    }
  }, [isLoading, canLoadMore]);

  useEffect(() => {
    if (canLoadMore) {
      dispatch(Action.OnCanLoadMore);
    }
  }, [canLoadMore]);

  useEffect(() => {
    if (!loadingRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(Action.OnInternalLoad);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0,
      }
    );

    const triggerEl = loadingRef.current;
    observer.observe(triggerEl);
    return () => {
      observer.unobserve(triggerEl);
    };
  }, []);

  const loadingContent = useMemo(() => {
    if (loadState === State.LoadingExternal) {
      return null;
    }

    if (!canLoadMore) {
      if (!allDataLoadedMessage) {
        return null;
      }
      return (
        <Text.Paragraph size={TextSize.Small}>
          {allDataLoadedMessage}
        </Text.Paragraph>
      );
    }

    return (
      <LoadingContainer>
        <LoadingSpinner {...loadingSpinnerProps} />
      </LoadingContainer>
    );
  }, [allDataLoadedMessage, canLoadMore, loadState, loadingSpinnerProps]);

  return (
    <ScrollMessage data-testid="load-more-on-scroll" ref={loadingRef}>
      {loadingAlert && (
        <AriaOnlyAlert role="status">{loadingAlert}</AriaOnlyAlert>
      )}
      {loadingContent}
    </ScrollMessage>
  );
}

export default InfiniteScroller;
