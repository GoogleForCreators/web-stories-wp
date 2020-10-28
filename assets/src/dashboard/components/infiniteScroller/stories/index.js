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
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import InfiniteScroller from '../';

export default {
  title: 'Dashboard/Components/InfiniteScroller',
  component: InfiniteScroller,
};

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 300px;
  padding: 20px;
  margin-top: 20px;
  background-color: teal;
  color: salmon;
  font-size: 30px;
  font-weight: 600;
  &:nth-child(odd) {
    background-color: salmon;
    color: teal;
  }
`;

const generateArray = (n) => new Array(n).fill(<span>{'Demo Item'}</span>);

export const _default = () => {
  const [currentCount, setCurrentCount] = useState(5);
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dummyData, setDummyData] = useState(generateArray(currentCount));

  useEffect(() => {
    setDummyData(generateArray(currentCount));
    if (currentCount === 30) {
      setIsAllDataLoaded(true);
    }
    setIsLoading(false);
  }, [currentCount]);

  if (dummyData.length > 0) {
    return (
      <>
        {dummyData.map((data, index) => (
          //eslint-disable-next-line react/no-array-index-key
          <Item key={index}>
            {data} {index}
          </Item>
        ))}
        <InfiniteScroller
          onLoadMore={() => {
            setIsLoading(true);
            setCurrentCount(currentCount + 5);
          }}
          isLoading={isLoading}
          canLoadMore={!isAllDataLoaded}
          loadingMessage={text(
            'loadingMessage',
            'Data is loading - please note, interesection observers and storybook do not play nicely in firefox.'
          )}
          allDataLoadedMessage={text(
            'allDataLoadedMessage',
            'all data is loaded'
          )}
        />
      </>
    );
  }
  return null;
};
