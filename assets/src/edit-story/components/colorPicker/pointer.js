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
import styled from 'styled-components';

const Circle = styled.div`
	width: 12px;
	height: 12px;
	background: radial-gradient(circle at center 6px, transparent, transparent 4px, #fff 4px);
	filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.38));
	border-radius: 100%;
`;

const CircleWithOffset = styled( Circle )`
	transform: translate(-6px, -6px);
`;

export default function Pointer() {
	return <CircleWithOffset />;
}

export function PointerWithoutOffset() {
	return <Circle />;
}

