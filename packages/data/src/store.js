/*
 * Copyright 2022 Google LLC
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
import create from 'zustand/vanilla';

const store = create((set, get) => ({
  addSlice: (name, slice) => set({ [name]: slice(set, get) }),
}));

const { getState, setState, subscribe, destroy } = store;

const addSlice = (name, slice) => getState().addSlice(name, slice);

const select = (sliceName) => (sliceName ? getState()[sliceName] : getState());

// select() and dispatch() both return actions which can be used to update state.
const dispatch = select;

export { setState, subscribe, destroy, select, dispatch, addSlice };
