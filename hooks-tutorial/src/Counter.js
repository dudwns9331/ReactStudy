import React, { useState } from "react";

// 8장 Hooks - useState : Counter

const Counter = () => {
  // 첫번째 값은 상태를 나타내는 값이고 두번째 값은 그 상태를 변경하는 set 함수이다.
  const [value, setValue] = useState(0);

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{value}</b>입니다.
      </p>
      <button onClick={() => setValue(value + 1)}>+1</button>
      <button onClick={() => setValue(value - 1)}>-1</button>
    </div>
  );
};

export default Counter;
