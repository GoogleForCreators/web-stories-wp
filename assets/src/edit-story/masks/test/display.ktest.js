
import { render } from 'react-dom';
import {WithMask} from '../display';

describe('karmatic test', () => {

  it('should work', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(<WithMask element={element}>hello!</WithMask>, container);
    expect(container.textContent).toEqual('hello!');
  });

});
