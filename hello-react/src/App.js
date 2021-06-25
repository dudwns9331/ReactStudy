import React from 'react';
import MyComponent from './MyComponent';
import Counter from './Counter';
import Say from './Say';

const App = () => {
  return (
    <>
      {/* 컴포넌트, props 예시 */}
      <MyComponent name="하이">리액트</MyComponent>
      {/* state 예시 */}
      <Counter></Counter>
      <Say></Say>
    </>
  );
};

export default App;
