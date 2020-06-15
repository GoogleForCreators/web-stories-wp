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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { Alert } from '../../../../components/alert';
import { ApiContext } from '../../../api/apiProvider';
import ErrorQueue from '../';

export default {
  title: 'Dashboard/Views/ErrorQueue',
  component: ErrorQueue,
};

export const _default = () => {
  const [error, setError] = useState();

  return (
    <ApiContext.Provider value={{ state: { stories: { error } } }}>
      <button
        onClick={() => {
          setError({ message: 'i am an error' });
        }}
      >
        {'Add Error'}
      </button>
      <Alert.Provider>
        <ErrorQueue />
      </Alert.Provider>
    </ApiContext.Provider>
  );
};
