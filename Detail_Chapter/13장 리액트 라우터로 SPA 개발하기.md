## 2021-07-09

# 13장 리액트 라우터로 SPA 개발하기

<br>

#### **SPA란?**

SPA는 Single Page Application(싱글 페이지 애플리케이션)의 약어로 한 개의 페이지로 이루어진 애플리케이션이라는 의미이다.

<br>

기존에는 사용자가 다른 페이지로 이동할 때마다 새로운 HTML을 받아 오고, 페이지를 로딩할 때마다 서버에서 리소스를 전달받아 해석한 뒤 화면에 보여 주었다. 사용자에게 보이는 화면을 서버측에서 준비했는데 요즘은 웹에서 제공하는 정보가 많기 때문에 새로운 화면을 보여 주어야 할 때마다 서버측에서 모든 뷰를 준비한다면 성능상의 문제가 발생할 수 있다.

<br>

사용자와의 인터렉션이 자주 발생하는 모던 웹 애플리케이션에서는 앞의 방법은 적절하지 않다. 애플리케이션 내에서 화면 전환이 일어날 때마다 html을 계속 서버에 새로 요청하면 사용자의 인터페이스에서 사용하고 있던 상태를 유지하는 것도 번거롭고 바뀌지 않는 부분까지 새로 불러와서 보여 주어야 하기 때문에 불필요한 로딩이 있어서 비효율적이다.

<br>

그래서 리액트 같은 라이브러리 혹은 프레임워크를 사용하여 뷰 렌더링을 사용자의 브라우저가 담당하도록 하고, 우선 애플리케이션을 브라우저에 불러와서 실행시킨 후 사용자와의 인터렉션이 발생한다면 필요한 부분만 자바스크립트를 사용하여 업데이트 해준다.

<br>

브라우저의 API를 직접 사용하여 관리하거나 라이브러리를 사용하여 라우팅 작업을 할 수 있는데, 리액트 라우팅 라이브러리는 `리액트 라우터(react-router), 리치 라우터(reach-router), Next.js`등 여러 가지가 있다.

<br>

이 중 리액트 라우터를 이용해서 실습을 해보고 학습하도록 한다. 리액트 라우터는 클라이언트 사이드에서 이루어지는 라우팅을 아주 간단하게 구현할 수 있도록 해주고 서버 사이드 렌더링을 할 때도 라우팅을 도와주는 컴포넌트들을 제공해 준다.

<br>

#### **SPA의 단점**

<br>

SPA의 단점은 앱의 규모가 커지면 자바스크립트 파일이 너무 커진다는 것이다. 페이지 로딩 시 사용자가 실제로 방문하지 않을 수 도 있는 페이지의 스크립트도 불러오기 때문이다. 이는 `코드 스플라이팅`을 사용하면 라우트별로 파일들을 나누어서 트래픽과 로딩 속도를 개선할 수 있다.

<br>

리액트 라우터처럼 브라우저에서 자바스크립트를 사용하여 라우팅을 관리하는 것은 자바스크립트를 실행하지 않는 일반 크롤러에서는 페이지의 정보를 제대로 수집해 가지 못한다는 잠재적인 단점이 따른다. 또한, 자바스크립트가 실행될 때까지 페이지가 비어 있기 떄문에 자바스크립트 파일이 로딩되어 실행되는 짧은 시간 동안 흰 페이지가 나타날 수 있다는 단점도 있다. 이러한 문제들은 `서버 사이드 렌더링`을 통해 모두 해결 가능하다.

<br>

---

### 프로젝트 준비 및 기본적인 사용법

<br>

```s
$ yarn create react-app router-tutorial
$ cd router-tutorial
$ yarn add react-router-dom
```

yarn을 통해서 react-router-dom이라는 라이브러리를 설치하도록 한다.

**index.js**

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

리액트 라우터를 적용할 때는 `react-router-dom`에 내장되어 있는 `BrowserRouter`라는 컴포넌트를 사용하여 감싸면 된다. 이 컴포넌트는 HTML5의 History API를 사용하여 페이지를 새로고침하지 않고도 주소를 변경하고, 현재 주소에 관련된 정보를 props로 쉽게 조회하거나 사용할 수 있도록 해준다.

<br>

**Home.js**

```js
import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>홈</h1>
      <p>홈, 그 페이지는 가장 먼저 보여지는 페이지.</p>
    </div>
  );
};

export default Home;
```

**About.js**

```js
import React from 'react';

const About = () => {
  return (
    <div>
      <h1>소개</h1>
      <p>이 프로젝트는 리액트 라우터 기초를 실습해 보는 예제 프로젝트입니다.</p>
    </div>
  );
};

export default About;
```

페이지로 사용할 컴포넌트를 생성하도록 한다.

<br>

Router라는 컴포넌트를 사용하여 사용자의 현재 경로에 따라 다른 컴포넌트를 보여준다. Route 컴포넌트를 사용하면 어떤 규칙을 가진 경로에 어떤 컴포넌트를 보여줄 지 정의할 수 있다.

**Example**

```js
<Router path="주소규칙" component={보여줄 컴포넌트} />
```

**App.js**

```js
import React from 'react';
import { Route } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Route path="/" component={Home} exact={true} />
      <Route path="/about" component={About} />
    </div>
  );
};

export default App;
```

슬래시 하나의 규칙에 about, home 모두 걸리므로 `exact={true}`를 통해서 정확히 맞는 규칙에만 컴포넌트가 생성되도록 한다.
