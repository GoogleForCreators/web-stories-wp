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
import { Button } from '../../../../components';
import { ToastProvider } from '../../../../components/toaster';
import { ApiContext } from '../../../api/apiProvider';
import ToasterView from '../';

export default {
  title: 'Dashboard/Views/Toaster',
  component: ToasterView,
};

export const _default = () => {
  const [error, setError] = useState();
  const [errorIndexToAdd, setErrorIndexToAdd] = useState(0);
  const errors = [
    { message: 'i am an error' },
    { message: 'i am a second error' },
    { message: 'i am third' },
    { message: 'something is really not working!' },
    { message: 'oh no!' },
  ];

  return (
    <ApiContext.Provider value={{ state: { stories: { error } } }}>
      <Button
        onClick={() => {
          setErrorIndexToAdd(errorIndexToAdd + 1);
          setError({ ...errors[errorIndexToAdd], id: errorIndexToAdd });
        }}
        isDisabled={errorIndexToAdd > errors.length - 1}
      >
        {errorIndexToAdd > errors.length - 1
          ? 'No more practice alerts'
          : 'Add practice alert'}
      </Button>
      <ToastProvider>
        <ToasterView />
      </ToastProvider>
    </ApiContext.Provider>
  );
};
