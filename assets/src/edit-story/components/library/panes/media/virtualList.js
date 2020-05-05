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
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { getResourceFromAttachment } from '../../../../app/media/utils';
import MediaElement from './mediaElement';

const PREVIEW_SIZE = 150;

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth) {
  const ratio = Math.min(maxWidth / srcWidth);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

const Outer = styled.div`
  position: relative;
  overflow: auto;
  height: 500px; // just for now
  will-change: transform;
`;

const Inner = styled.div`
  height: auto;
  display: flex;
`;

const Column = styled.div`
  position: relative;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  margin-left: 10px;
`;

const Placeholder = memo(
  (props) => {
    const { index, style } = props;
    return (
      <Box {...props}>
        <span
          style={{
            position: 'absolute',
            fontSize: 12,
            lineHeight: 1,
            background: 'rgba(0,0,0,.5)',
          }}
        >
          {index} @ {Math.round(style.top)}px
          <br />
          {Math.random()}
        </span>
      </Box>
    );
  },
  () => true
);
const Box = styled.div`
  background: dodgerblue;
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin-bottom: 10px;
  contain: strict;
  overflow: hidden;
`;

function VirtualList({
  resources: globalResources,
  loadNextPage,
  localScopeMedia,
  insertMediaElement,
}) {
  const [localResources, setLocalResources] = useState([]);
  const resources = localScopeMedia ? localResources : globalResources;

  // For local data
  const {
    actions: { getMedia },
  } = useAPI();
  const [p, setP] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const searchTerm = undefined;
  const fetchMedia = useCallback(
    ({ pagingNum: p = 1, mediaType: currentMediaType } = {}, callback) => {
      setIsFetching(true);
      // fetchMediaStart({ pagingNum: p });
      getMedia({ mediaType: currentMediaType, searchTerm, pagingNum: p }).then(
        ({ data, headers }) => {
          const totalPages = parseInt(headers.get('X-WP-TotalPages'));
          const totalItems = parseInt(headers.get('X-WP-Total'));
          const mediaArray = data.map(getResourceFromAttachment);
          callback({
            media: mediaArray,
            mediaType: currentMediaType,
            searchTerm,
            pagingNum: p,
            totalPages,
            totalItems,
          });
        }
      );
    },
    [getMedia, searchTerm]
  );
  const gotNewMedia = useCallback(({ media }) => {
    setLocalResources((v) => [...v, ...media]);
    setIsFetching(false);
  }, []);

  const outerRef = useRef();
  const innerRef = useRef();
  const timeoutRef = useRef();
  const [scrollInfo, setScrollInfo] = useState({
    from: 0,
    to: null,
    isScrolling: false,
    height: null,
  });

  const [debouncedIsScrollingFalse] = useDebouncedCallback(() => {
    setScrollInfo((info) => ({ ...info, isScrolling: false }));
  }, 500);

  const onScrollExec = (evt) => {
    const { scrollTop, clientHeight, scrollHeight } = evt.target;
    const from = scrollTop;
    const to = scrollTop + clientHeight;

    setScrollInfo((info) => ({ ...info, from, to, isScrolling: true }));
    debouncedIsScrollingFalse();

    const nextPageFetchPadding = 9000;
    if (isFetching === false && to + nextPageFetchPadding >= scrollHeight) {
      if (localScopeMedia) {
        setP((v) => v + 1);
      } else {
        loadNextPage();
      }
    }
  };

  useEffect(() => {
    if (localScopeMedia) {
      fetchMedia({ pagingNum: p }, gotNewMedia);
    }
  }, [gotNewMedia, fetchMedia, p, localScopeMedia]);

  const handleRAFScroll = (evt) => {
    if (timeoutRef.current) {
      window.cancelAnimationFrame(timeoutRef.current);
    }
    timeoutRef.current = window.requestAnimationFrame(function () {
      onScrollExec(evt);
    });
  };
  const [debouncedHandleScroll] = useDebouncedCallback((evt) => {
    onScrollExec(evt);
  }, 100); //66

  useEffect(() => {
    const outerNode = outerRef.current;
    // outerNode.addEventListener('scroll', handleRAFScroll, { passive: true });
    outerNode.addEventListener('scroll', debouncedHandleScroll, {
      passive: true,
    });
    return () => {
      // outerNode.removeEventListener('scroll', handleRAFScroll, { passive: true });
      outerNode.removeEventListener('scroll', debouncedHandleScroll, {
        passive: true,
      });
    };
  }, [debouncedHandleScroll]);

  useEffect(() => {
    const outerNode = outerRef.current;
    const innerNode = innerRef.current;
    const { scrollTop, clientHeight } = outerNode;
    setScrollInfo((info) => ({
      ...info,
      from: scrollTop,
      to: scrollTop + clientHeight,
      height: innerNode.clientHeight,
    }));
  }, [resources]);

  const [columns, columnsCumulativeTop] = useMemo(() => {
    if (resources.length === 0) {
      return [[], [[], []]];
    }
    const columns = [[], []];
    const columnsCumulativeTop = [[0], [0]];

    const ITEM_MARGIN_BOTTOM = 10;

    for (let i = 0, n = resources.length; i < n; i++) {
      const resource = resources[i];
      const { width: originalWidth, height: originalHeight } = resource;

      const oRatio =
        originalWidth && originalHeight ? originalWidth / originalHeight : 1;
      const itemHeight = PREVIEW_SIZE / oRatio;
      const itemTotalHeight = itemHeight + ITEM_MARGIN_BOTTOM;

      const columnsHeights = columnsCumulativeTop.map((c) => c[c.length - 1]);
      const destColumn = columnsHeights.indexOf(Math.min(...columnsHeights));

      columns[destColumn].push(i);
      columnsCumulativeTop[destColumn].push(
        columnsHeights[destColumn] + itemTotalHeight
      );
    }

    return [columns, columnsCumulativeTop];
  }, [resources]);

  const jsx = columns.map((column, columnIndex) => {
    return (
      <Column
        key={columnIndex}
        width={150}
        height={
          columnsCumulativeTop[columnIndex][
            columnsCumulativeTop[columnIndex].length - 1
          ]
        }
      >
        {column.map((resourceIndex, i) => {
          const resource = resources[resourceIndex];

          const resized = calculateAspectRatioFit(
            resource.width,
            resource.height,
            150
          );

          const top = columnsCumulativeTop[columnIndex][i];
          const elFrom = top;
          const elTo = top + resized.height;

          const padding = 3000;
          let isVisible =
            elTo >= scrollInfo.from - padding &&
            elFrom <= scrollInfo.to + padding;

          const placeholderPadding = 5000;
          let isPlaceholderVisible =
            elTo >= scrollInfo.from - placeholderPadding &&
            elFrom <= scrollInfo.to + placeholderPadding;

          let Component = isVisible ? MediaElement : Placeholder;
          const height = isVisible ? undefined : resized.height;

          const style = { top };

          // if (!isPlaceholderVisible) {
          //   return null;
          // }

          // if (isScrolling === true) {
          //   Component = Placeholder;
          // }

          return (
            <Component
              resource={resource}
              key={resourceIndex}
              index={resourceIndex}
              width={PREVIEW_SIZE}
              height={height}
              style={style}
              onInsert={insertMediaElement}
            />
          );
        })}
      </Column>
    );
  });

  return (
    <>
      <pre
        style={{
          fontSize: 12,
          lineHeight: 1,
          background: 'black',
          position: 'absolute',
          top: 0,
          zIndex: 999,
        }}
      >
        {JSON.stringify(
          {
            scrollInfo,
            resourcesN: resources.length,
          },
          null,
          2
        )}
      </pre>
      <Outer ref={outerRef}>
        <Inner
          ref={innerRef}
          style={{ pointerEvents: scrollInfo.isScrolling ? 'none' : undefined }}
        >
          {jsx}
        </Inner>
      </Outer>
    </>
  );
}

export default VirtualList;
