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
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from '@googleforcreators/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const AudioWrapper = styled.div`
  background: #26292a;
  border-radius: 5px;
  width: 100%;
  height: 100%;
`;

export const Audio = ({ liveStream }) => (
  <AudioWrapper>
    <AudioAnalyser source={liveStream} />
  </AudioWrapper>
);

Audio.propTypes = {
  liveStream: PropTypes.object,
};

const audioContext = new window.AudioContext();
const analyser = audioContext.createAnalyser();

const AudioAnalyser = (props) => {
  const [data, setData] = useState([]);
  const raf = useRef();
  const prevRafTime = useRef();

  const tick = useCallback((time) => {
    if (prevRafTime.current !== undefined) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(dataArray);
      setData(dataArray);
    }
    prevRafTime.current = time;
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const source = audioContext.createMediaStreamSource(props.source);
    source.connect(analyser);

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      analyser.disconnect();
      source.disconnect();
    };
  }, [props.source, tick]);

  return <AudioVisualiser data={data} />;
};

AudioAnalyser.propTypes = {
  source: PropTypes.object,
};

const AudioVisualiser = ({ data }) => {
  const ref = useRef();
  const canvas = ref.current;
  if (canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    const sliceWidth = Number(width) / data.length;

    context.lineWidth = 2;
    context.strokeStyle = '#FFF';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    let x = 0;
    for (const item of data) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }

  return <canvas ref={ref} />;
};

AudioVisualiser.propTypes = {
  data: PropTypes.object,
};
