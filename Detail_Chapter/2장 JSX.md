## 2021-06-20

# 2장 JSX

### 2.1 코드 이해하기

<br>

App.js의 파일을 열어보고 분석해보자.

```jsx
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
```

`import React from "react"` 는 리액트를 불러와서 사용할 수 있게 해준다. `node_modules` 라는 디렉터리도 함께 생성되는데 이 디렉터리로부터 react 모듈이 설치된다. 이는 import를 통해서 사용 가능해진다.

<br/>

이렇게 모듈을 불러와서 사용하는 것은 사실 원래의 브라우저에는 없던 기능이다. 브라우저가 아닌 호나경에서 자바스크립트를 실행할 수 있게 해주는 환경인 [Node.js](https://nodejs.org/ko/)에서 지원하는 기능이다. 이런 기능을 사용하기 위해서 `bundler`를 사용한다. 번들러는 파일을 묶고 연결한다는 의미를 가진다.

<br/>

#### 번들러?

번들러는 대표적으로 웹팩, Parcel, browserify 라는 도구들을 사용한다. 리액트 프로젝트에서는 주로 웹팩을 사용하는 추세이다.
번들러 도구를 사용하면 import(require)로 모듈을 불러왔을 때 불러온 모듈을 모두 합쳐서 하나의 파일을 생성하게 해준다.

```js
import logo from "./logo.svg";
import "./App.css";
```

웹팩을 사용하면 위와같이 SVS파일과 CSS 파일을 불러와 사용 가능하다. 이는 웹팩의 loader라는 기능이 담당하는데, 로더도 여러가지 종류가 있다. babel-loader는 자바스크립트 파일들을 불러오면서 최신 자바스크립트 문법으로 작성된 코드를 [babel](https://babeljs.io/)이라는 도구를 사용하여 ES5 문법으로 변환해준다(구버전의 호환을 위해서 변환함).

### 2.2 JSX란?

<br/>

JSX는 자바스크립트의 확장 문법이며 XML과 매우 비슷하다. 코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환된다.

```jsx
function App() {
  return (
    <div>
      Hello <b>react</b>
    </div>
  );
}
```

```js
function App() {
  return React.createElement(
    "div",
    null,
    "Hello",
    React.createElement("b", null, "react")
  );
}
```

위의 코드는 아래 코드와 같이 변환된다.

<br>

#### JSX도 자바스크립트 문법이라고 할 수 있는가?

JSX는 리액트로 프로젝트를 개발할 때 사용되므로 공식적인 자바스크립트 문법은 아니다. 바벨에서 여러 문법을 지원할 수 있도록 preset 및 plugin을 설정한다. 바벨을 통해 개발자들이 임의로 만든 문법, 혹은 차기 자바스크립트의 문법들을 사용할 수 있다.

<br/>

### 2.3 JSX의 장점

<br/>

1.  보기 쉽고 익숙하다.

    - HTMl을 작성하는것과 비슷하기 때문에 익숙하다.

2.  높은 활용도

    - HTML 태그를 사용할 뿐만 아니라, 컴포넌트를 작성할 때 마치 HTML을 작성하듯이 하기 때문에 활용도가 높다.

<br>

#### index.js

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

`React.DOM.render` 는 컴포넌트 페이지에 렌더링하는 역할을 하며, `react-dom` 모듈을 불러와 사용할 수 있다. 이 함수의 첫 번째 파라미터에는 페이지에 렌더링할 내용을 JSX 형태로 작성하고, 두번째 파라미터에는 해당 JSX를 렌더링 할 document 내부 요소를 설정한다. id가 root인 요소 안에 렌더링을 하도록 설정되어 있다. 이는 `public/index.html` 파일에 있다.

<br/>

### 2.4 JSX 문법

**컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다.**

<br/>

이는 Virtual DOM에서 컴포넌트 변화를 감지해 낼 때 효율적으로 비교할 수 있도록 **컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다는 규칙이 있기 때문이다.** 따라서 하나의 요소로 묶기 위해서는 `Fragment`라는 기능을 사용한다.

```js
function App() {
  return (
    <fragment>
      <h1> 하이 </h1>
      <h1> 바이 </h1>
    </fragment>
  );
}
```

`Fragment`는 `<></>` 로 바꿔서 표현이 가능하다.

<br>

#### ES6의 const와 let

`const`는 ES6문법에서 새로 도입되었으며 한번 지정하고 나면 변경이 불가능한 상수를 선언할 때 사용하는 키워드이다. `let`은 동적인 값을 담을 수 있는 변수를 선언할 때 사용되는 키워드이다. let과 const는 scope가 함수 단위가 아닌 블록 단위이고 같은 블론 내부에서 중복 선언이 불가능하다. 그리고 const는 한번 선언하면 재설정이 불가능하다. 따라서 let은 선언한 후 값이 유동적으로 변할 수 있을때만 사용하고, const는 한번 설정한 후 변할 일이 없는 값에 사용한다.

<br/>

### 2.5 if문 대신 조건부 연산자

JSX 내부의 자바스크립트 표현식에서 if문을 사용할 수는 없다. 따라서 조건에 따라 내용을 렌더링 할때는 JSX 밖에서 if문을 사용하거나 { } 안에 조건부 연산자를 사용하면 된다.

```jsx
return (
  <div>
    {name === "리액트" ? <h1>리액트입니다.</h1> : <h1>리액트가 아닙니다.</h1>}
  </div>
);
```

위와같이 `name`의 값이 `true`인 경우에는 h1 태그에 적힌 `"리액트입니다."` 라는 컴포넌트가 렌더링되고 반대로 `false`인 경우는 `"리액트가 아닙니다."` 가 렌더링되게 된다.

### 2.6 인라인 스타일링

<br/>

리액트에서 DOM 요소에 스타일을 적용할 때는 문자열 형태로 넣는 것이 아니라 객체 형태로 넣어 주어야 한다. 따라서 카멜 표기법으로 작성해야한다. 예를 들어 background-color는 backgroundColor로 작성하게 된다.

<br/>

### 2.7 class 대신 ClassName

<br/>

일반 HTML에서 CSS 클래스를 사용할때는 class라는 속성을 설정한다. 하지만 JSX에서는 class가 아닌 className으로 설정해 주어야 한다.
