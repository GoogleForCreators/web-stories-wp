import { useReducer, shallowEqual, useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';

function createMockUseContextSelector(getContextValue = () => null) {
  const memoMap = {};
  const instanceRerenderMap = {};

  return {
    forceRender: () => {
      Object.values(instanceRerenderMap).forEach((forceInstanceRender) =>
        forceInstanceRender()
      );
    },

    mockUseContextSelector: (selector = (v) => v) => {
      const [, _forceRender] = useReducer((c) => c + 1, 0);

      // register this instance
      const instanceId = useMemo(() => {
        const id = uuidv4();
        instanceRerenderMap[id] = _forceRender;
        return id;
      }, []);

      // see if we want to return memoized value or not
      const newValue = selector(getContextValue());
      if (!shallowEqual(newValue, memoMap[instanceId])) {
        memoMap[instanceId] = newValue;
      }
      return memoMap[instanceId];
    },
  };
}
export default createMockUseContextSelector;
