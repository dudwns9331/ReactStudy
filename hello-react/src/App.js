import React, { Component } from "react";
import MyComponent from "./MyComponent";
import Counter from "./Counter";
import Say from "./Say";
import EventPractice from "./EventPractice";
import ValidationSample from "./ValidationSample";
import ScrollBox from "./ScrollBox";
import IterationSample from "./IterationSample";

class App extends Component {
  render() {
    return (
      <>
        {/* 컴포넌트, props 예시 */}
        <MyComponent name="하이">리액트</MyComponent>
        {/* state 예시 */}
        <Counter></Counter>
        <Say></Say>
        {/* 4장 이벤트 연습 */}
        <EventPractice />
        {/* 4장 이벤트 연습 2 */}
        <ValidationSample />
        {/* 5장 컴포넌트에 ref 달기 */}
        <div>
          <ScrollBox
            ref={(ref) => {
              this.scrollBox = ref;
            }}
          />
          <button onClick={() => this.scrollBox.scrollToBottom()}>
            맨 밑으로
          </button>
        </div>
        {/* 6장 컴포넌트 반복 */}
        <IterationSample />
      </>
    );
  }
}

export default App;
