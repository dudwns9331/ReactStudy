import React, { useReducer } from "react";

function reducer(state, action) {
  // action.type 에 따라서 다른 작업 수행
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + 1 };

    case "DECREMENT":
      return { value: state.value - 1 };
    default:
      // 아무것도 해당되지 않을 때 기존 상태 반환
      return state;
  }
}

const CounterReducer = () => {
  // dispatch는 action을 발생시키는 함수이다.
  // useReducer는 리듀서함수, state의 초기값을 파라미터로 갖는다.
  const [state, dispatch] = useReducer(reducer, { value: 0 });

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{state.value}</b> 입니다.
      </p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
    </div>
  );
};

export default CounterReducer;
