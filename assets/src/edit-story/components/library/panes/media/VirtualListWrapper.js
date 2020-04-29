import React from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import MediaElement from './mediaElement';

export default function VirtualListWrapper({
  useIsScrolling,
  simpleImage,

  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage,

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading,

  // Array of items loaded so far.
  items,

  // Callback function responsible for loading the next page of items.
  loadNextPage,
}) {
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = (props) => {
    const { index, style, isScrolling } = props;
    const item = items[index];
    let background;
    let content;

    if (isScrolling) {
      content = 'Scrolling...';
      background = '#191C28';
    } else if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      // For testing on my low-end device on LAN
      item.src = item.src.replace('http://localhost:8899/', '/');
      console.log({item})

      background = '#242A3B';
      if (simpleImage) {
        if (item.type === 'video') {
          content = <img src={item.poster} height={100} />;
        } else {
          content = <img src={item.src} height={100} />;
        }
      } else {
        content = <MediaElement
          resource={item}
        />
      }

    }

    return (
      <div
        style={{
          ...style,
          background,
          overflow: 'hidden',
          top: style.top + 10,
          height: style.height - 10,
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          useIsScrolling={useIsScrolling}
          className="List"
          height={500}
          itemCount={itemCount}
          itemSize={110}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}
