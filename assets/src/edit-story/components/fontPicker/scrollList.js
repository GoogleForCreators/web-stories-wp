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
import { useEffect, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
  position: relative;
`;

const Placeholder = styled.div`
  height: ${({ height }) => height}px;
  width: 100%;
`;

const Item = styled.li.attrs({
  tabIndex: -1,
  role: 'option',
})`
  overflow: hidden;
  position: ${({ top }) => (top ? 'absolute' : 'initial')};
  top: ${({ top }) => top}px;
`;

// Number of additional fonts to load while scrolling.
const FONTS_PER_LOAD = 20;

function ScrollList({
  id,
  items,
  itemRenderer,
  onScroll,
  currentOffset,
  className,
  onKeyDown,
}) {
  const ref = useRef();
  const itemRefs = useRef([]);
  const numItems = items.length;
  const [itemHeight, setItemHeight] = useState(0);

  const setRef = useCallback(
    (index) => (node) => {
      if (!node) {
        return;
      }
      if (!itemHeight && node.scrollHeight) {
        setItemHeight(node.scrollHeight);
      }
      itemRefs.current[index] = node;
    },
    [itemHeight]
  );

  const indexRef = useRef({ startFrom: 0, endAt: FONTS_PER_LOAD });
  const [itemsToRender, setItemsToRender] = useState(
    items.slice(indexRef.current.startFrom, indexRef.current.endAt)
  );

  const [handleScroll] = useDebouncedCallback(
    (evt) => {
      if (!evt.target || !itemHeight) {
        return;
      }
      const {
        target: { scrollTop, clientHeight },
      } = evt;

      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / itemHeight) - FONTS_PER_LOAD
      );
      const endIndex =
        Math.min(
          items.length - 1,
          Math.floor((scrollTop + clientHeight) / itemHeight)
        ) + FONTS_PER_LOAD;

      onScroll(startIndex, endIndex);

      const hasChanges =
        indexRef.current.startFrom !== startIndex ||
        indexRef.current.endAt !== endIndex;
      indexRef.current = {
        startFrom: startIndex,
        endAt: endIndex,
      };
      if (hasChanges) {
        setItemsToRender(items.slice(startIndex, endIndex));
      }
    },
    [onScroll, numItems]
  );

  // If the items list changes, default the indexes and items to render
  // to ensure the new list is being rendered from the beginning again.
  useEffect(() => {
    indexRef.current = { startFrom: 0, endAt: FONTS_PER_LOAD };
    setItemsToRender(
      items.slice(indexRef.current.startFrom, indexRef.current.endAt)
    );
  }, [items]);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    // Invoke now
    handleScroll({ target: node });
    // And when scroll changes (but debounced)
    node.addEventListener('scroll', handleScroll);
    return () => node.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // If current offset changes, scroll to that one
  useEffect(() => {
    const node = ref.current;
    if (!node) {
      // Just focus first node
      return;
    }

    if (currentOffset === -1) {
      node.scrollTo(0, 0);
      return;
    }

    const currentNode = itemRefs.current[currentOffset];
    currentNode.focus();
    node.scrollTo(0, currentNode.offsetTop - node.clientHeight / 2);
  }, [currentOffset, numItems]);

  // Trim to current length of list
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, numItems);
  }, [numItems]);

  return (
    <List
      id={id}
      className={className}
      aria-multiselectable={false}
      aria-required={false}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      {itemsToRender.map((item, index) => (
        <Item
          ref={setRef(index)}
          key={index}
          aria-posinset={index + 1}
          aria-selected={currentOffset === index}
          aria-setsize={numItems}
          top={(index + indexRef.current.startFrom) * itemHeight}
        >
          {itemRenderer(item, index)}
        </Item>
      ))}
      <Placeholder height={items.length * itemHeight} />
    </List>
  );
}

ScrollList.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  onScroll: PropTypes.func.isRequired,
  currentOffset: PropTypes.number,
  className: PropTypes.string,
  onKeyDown: PropTypes.func,
};

export default ScrollList;
