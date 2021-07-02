import React, { useState } from 'react';
import Counter from './Counter';
import Info from './Info';
import CounterReducer from './CounterReducer';
import InfoReducer from './InfoReducer';
import Average from './Average';
import AverageMemo from './AverageMemo';
import InfoHooks from './InfoHooks';

const App = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {/* 8장 useState : Counter */}
      <Counter />
      <br />

      {/* 8장 useState : Info */}
      <button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? '숨기기' : '보이기'}
      </button>
      <hr />
      {visible && <Info />}

      {/* 8장 useReducer : CounterReducer */}
      <CounterReducer />
      <br />

      {/* 8장 useReducer : InfoReducer */}
      <InfoReducer />
      <br />

      {/* 8장 useMemo : Average */}
      <Average />
      <br />

      {/* 8장 useMemo : AverageMemo */}
      <AverageMemo />
      <br />

      {/* 8장 useMemo : AverageMemo */}
      <InfoHooks />
      <br />
    </>
  );
};

export default App;
