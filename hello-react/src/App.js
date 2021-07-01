import React, { Component } from "react";
import MyComponent from "./MyComponent";
import Counter from "./Counter";
import Say from "./Say";
import EventPractice from "./EventPractice";
import ValidationSample from "./ValidationSample";
import ScrollBox from "./ScrollBox";
import IterationSample from "./IterationSample";
import LifeCycleSample from "./LifeCycleSample";
import ErrorBoundary from "./ErrorBoundary";

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

class App extends Component {
  state = {
    color: "#000000",
  };

  handleClick = () => {
    this.setState({
      color: getRandomColor(),
    });
  };

  render() {
    return (
      <>
        {/* 컴포넌트, props 예시 */}
        <MyComponent name="하이">리액트</MyComponent>

        <br />

        {/* state 예시 */}
        <Counter></Counter>
        <Say></Say>

        <br />

        {/* 4장 이벤트 연습 */}
        <EventPractice />

        <br />

        {/* 4장 이벤트 연습 2 */}
        <ValidationSample />

        <br />

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

        <br />

        {/* 6장 컴포넌트 반복 */}
        <IterationSample />

        <br />

        {/* 7장 컴포넌트 라이프 사이클 메서드 */}
        <div>
          <button onClick={this.handleClick}>랜덤 색상</button>
          <ErrorBoundary>
            <LifeCycleSample color={this.state.color} />
          </ErrorBoundary>
        </div>
      </>
    );
  }
}

export default App;
