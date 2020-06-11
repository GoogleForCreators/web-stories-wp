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
import { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

const List = styled.ul.attrs({ role: 'listbox' })`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: none auto;
`;

const Item = styled.li.attrs({
  tabIndex: -1,
  role: 'option',
})`
  overflow: hidden;
`;

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

  const setRef = useCallback(
    (index) => (node) => {
      if (!node) {
        return;
      }
      itemRefs.current[index] = node;
    },
    []
  );

  const [handleScroll] = useDebouncedCallback(
    (evt) => {
      if (!evt.target) {
        return;
      }
      const {
        target: { scrollTop, clientHeight },
      } = evt;
      const firstIndexInView = itemRefs.current.findIndex(
        ({ offsetTop }) => offsetTop > scrollTop
      );
      const firstIndexOutOfView = itemRefs.current.findIndex(
        ({ offsetTop }) => offsetTop > scrollTop + clientHeight
      );
      const lastIndexInView =
        firstIndexOutOfView === -1 ? numItems : firstIndexOutOfView - 1;
      onScroll(firstIndexInView, lastIndexInView);
    },
    [onScroll, numItems]
  );

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
      {items.map((item, index) => (
        <Item
          ref={setRef(index)}
          key={index}
          aria-posinset={index + 1}
          aria-selected={currentOffset === index}
          aria-setsize={numItems}
        >
          {itemRenderer(item)}
        </Item>
      ))}
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
