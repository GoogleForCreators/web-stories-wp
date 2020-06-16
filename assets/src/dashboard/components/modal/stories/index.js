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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import Modal from '..';

export default {
  title: 'Dashboard/Components/Modal',
  component: Modal,
};

export const _default = () => {
  const [toggleModal, setToggleModal] = useState(false);
  return (
    <>
      <h1>{'Dummy header for modal context'}</h1>
      <p>
        {
          "I can afford more glasses! White rabbit object: whatever it did, it did it all. Don't get cheap on me, Dodgson. Because we're being hunted. Bloody move! I told you, how many times, we needed locking mechanisms on the vehicle doors!"
        }
      </p>
      <button onClick={() => setToggleModal(!toggleModal)}>
        {'Toggle Modal'}
      </button>

      <Modal
        ariaHideApp={false} // this is ONLY for storybook to eliminate a warning, we set the app id in the root index of dashboard
        contentLabel={'my storybook modal label'}
        aria={{
          labelledby: 'additional heading for aria - optional',
          describedby: 'additional described by for aria - optional',
        }}
        isOpen={toggleModal}
        onClose={() => {
          action('close modal clicked');
          setToggleModal(!toggleModal);
        }}
      >
        <div>
          <h1>{'Modal Content Goes Here!'}</h1>
          <p>{'kjalskdjfalkdfjlkafjdlakdfj'}</p>
          <button>{'a button'}</button>
        </div>
      </Modal>
    </>
  );
};

export const OverriddenStyles = () => {
  const [toggleModal, setToggleModal] = useState(false);

  return (
    <>
      <h1>{'Dummy header for modal context'}</h1>
      <p>
        {
          "Don't get cheap on me, Dodgson. I told you, how many times, we needed locking mechanisms on the vehicle doors!"
        }
      </p>
      <button onClick={() => setToggleModal(!toggleModal)}>
        {'Toggle Modal'}
      </button>

      <Modal
        ariaHideApp={false} // this is ONLY for storybook to eliminate a warning, we set the app id in the root index of dashboard
        isOpen={toggleModal}
        onClose={() => {
          action('close modal clicked');
          setToggleModal(!toggleModal);
        }}
        contentStyles={{
          backgroundColor: 'salmon',
          borderRadius: '5px',
          padding: '10px 20px',
        }}
        overlayStyles={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
        }}
      >
        <div>
          <h1>{'Modal Content Goes Here!'}</h1>
          <p>{'kjalskdjfalkdfjlkafjdlakdfj'}</p>
          <button>{'a button'}</button>
        </div>
      </Modal>
    </>
  );
};
