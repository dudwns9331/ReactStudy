## 2021-06-29

# 5장 ref : DOM에 이름 달기

<br>

일반 HTML에 DOM 요소에 이름을 달 때는 id를 사용한다.

```html
<div id="my-element"></div>
```

특정 DOM 요소에 어떤 작업을 해야 할 때 이렇게 요소에 id를 달면 CSS에서 특정 id에 특정 스타일을 적용하거나 자바스크립트에서 해당 id를 가진 요소를 찾아서 작업하게 된다.

<br/>

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

리액트에도 `<div id="root"></div>` 를 통해서 id가 root인 요소를 div안에 렌더링하게 되는데 이는 `src/index.js`에 렌더링 하는 코드를 통해서 가능하다.

<br>

index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

`ReactDOM.render( 파라미터 1, 파라미터2 )` 를 통해서 렌더링하게 되는데 첫번째 파라미터에는 렌더링하고자 하는 컴포넌트를 넣게되고 두번째 파라미터는 그 요소를 `id = root` 인 DOM을 찾아서 렌더링 하도록 지정해준다.

<br>

리액트 컴포넌트 안에서는 id를 사용할 수 있지만, 특수한 경우가 아니면 사용을 권장하지 않는다. HTML에서 DOM의 id는 유일해야하는데, 이가 중복 id를 가진 DOM이 리액트 컴포넌트에 생길 수 있기 때문이다. ref는 전역적으로 작동하지 않고 컴포넌트 내부에서만 작동하기 때문에 문제는 발생하지 않는다. 하지만 다른 라이브러리나 프레임워크와 함께 id를 사용해야하는 상황이 발생할 수 있기 때문에 권장하지 않는다.

<br>

### 5.1 ref는 어떤 상황에서 사용해야 할까?

<br>

`DOM을 꼭 직접적으로 건드려야 할 때 사용한다.`

이를 알아보기 위해서 실습은

1. ValidationSample 컴포넌트 만들기
2. input에 ref 달기
3. 버튼을 누를 때마다 input에 포커스 주기

순서대로 진행된다.

<br>

ValidationSample.css

```css
.success {
  background-color: lightgreen;
}

.failure {
  background-color: lightcoral;
}
```

ValidationSample.js

```js
import React, { Component } from "react";
import "./ValidationSample.css";

class ValidationSample extends Component {
  state = {
    password: "",
    clicked: false,
    validation: false,
  };

  // 현재 상태의 업데이트
  // 발생하는 e.target.value로 password 값을 바꾼다.
  handleChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  // 버튼을 클릭했을 때 clicked 를 true로
  // validation의 password 값이 0000 인지 아닌지에 대한 boolean 값을 넣어준다.
  handleButtonClick = () => {
    this.setState({
      clicked: true,
      validation: this.state.password === "0000",
    });
  };

  render() {
    return (
      <div>
        <input
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          // 버튼이 클릭되었을 때, 상태가 성공이면 success 실패면 failure 로 css 클래스를 생성해준다.
          className={
            this.state.clicked
              ? this.state.validation
                ? "success"
                : "failure"
              : ""
          }
        />

        <button onClick={this.handleButtonClick}>검증하기</button>
      </div>
    );
  }
}

export default ValidationSample;
```

state를 사용해서 필요한 기능을 구현했지만, 가끔 state만으로 해결 할 수 없는 기능이 있다.

1. 특정 input에 포커스 주기
2. 스크롤 박스 조작하기
3. Canvas 요소에 그림 그리기 등

이때 어쩔 수 없이 DOM에 직접적으로 접근해야 하는데 ref를 사용하게 된다.

<br>

### 5.2 ref 사용

<br>

ref를 만드는 가장 기본적인 방법은 콜백 함수를 사용하는 것이다. ref 를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달해 주면 된다. 이 콜백 함수는 ref 값을 파라미터로 전달받는다. 그리고 함수 내부에서 파라미터로 받은 ref를 컴포넌트의 멤버 변수로 설정해 준다.

<br>

두번째 방법은 리액트에 내장되어 있는 createRef라는 함수를 사용하는 것이다. 이 함수를 사용해서 만들면 더 적은 코드로 쉽게 사용할 수 있다.

```js
import React, { Compoenet } from "react";

class RefSample extends Component {
  input = React.createRef();

  handleFocus = () => {
    this.input.current.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.input} />
      </div>
    );
  }
  export default RefSample;
}
```

<br>

### 5.3 컴포넌트에 ref 달기

<br>

리액트에서는 컴포넌트에도 ref를 달 수 있다. 컴포넌트 내부에 있는 DOM을 컴포넌트 외부에서 사용할 때 쓴다. 컴포넌트에 ref를 다는 방법은 DOM에 ref를 다는 방법과 같다.

1. ScrollBox 컴포넌트 만들기
2. 컴포넌트에 ref 달기
3. ref를 이용하여 컴포넌트 내부 메서드 호출하기

<br>

ScrollBox.js

```js
import React, { Component } from "react";

class ScrollBox extends Component {
  scrollToBottom = () => {
    const { scrollHeight, clientHeight } = this.box;

    /*
    비 구조화 할당 위와 아래는 같은 코드임
    const scrollHeight = this.box.srollHeght;
    const clientHeight = this.box.clientHeight;
    */

    this.box.scrollTop = scrollHeight - clientHeight;
  };

  render() {
    const style = {
      border: "1px solid black",
      height: "300px",
      width: "300px",
      overflow: "auto",
      position: "relative",
    };

    const innerStyle = {
      width: "100%",
      height: "650px",
      background: "linear-gradient(white, black)",
    };

    return (
      <div
        style={style}
        ref={(ref) => {
          this.box = ref;
        }}
      >
        <div style={innerStyle} />
      </div>
    );
  }
}

export default ScrollBox;
```

App.js

```js
<div>
  <ScrollBox
    ref={(ref) => {
      this.scrollBox = ref;
    }}
  />
  <button onClick={() => this.scrollBox.scrollToBottom()}>맨 밑으로</button>
</div>
```

컴포넌트 `ScrollBox`에 ref를 달아줌으로써 컴포넌트 파일내부가 아닌 `App.js` 파일에 `button` DOM에서 `onClick` 함수에 사용하도록 했다.

<br>

### 5.4 정리

<br>

컴포넌트 내부에서 DOM 에 직접 접근할 때는 ref를 사용한다. 먼저 ref를 사용하지 않도록 원하는 기능을 구현할 수 있는지 반드시 고려해야 한다. 서로 다른 컴포넌트끼리 데이터를 교환할 때 ref를 사용하는 것은 잘못된 사용이다. 하지만 리액트 사상에 어긋나는 설계이고 이는 앱 규모가 커지면 스파게티 코드처럼 꼬일 수 있다. 컴포넌트끼리 데이터를 교류할 때는 언제나 데이터를 부모 <-> 자식 흐름으로 교류해야 한다. 나중에 리덕스 혹은 Context API를 통해서 자율적으로 교류하는 방법을 배운다. 함수형 컴포넌트에서는 useRef라는 Hook 함수를 사용한다.
