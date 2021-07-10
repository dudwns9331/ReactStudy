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

<br>

#### Link 컴포넌트를 사용하여 다른 주소로 이동하기

<br>

`Link` 컴포넌트는 클릭하면 다른 주소로 이동시켜 주는 컴포넌트이다. 일반 웹 애플리케이션에서는 `a` 태그를 사용하여 페이지를 전환하는데 리액트 라우터를 사용할 때는 이 태그를 직접 사용하면 안된다. 이 태그는 페이지를 전환하는 과정에서 페이지를 새로 불러오기 때문에 애플리케이션이 들고 있는 상태를 모두 날려버리기 때문이다. 따라서 렌더링 된 컴포넌트들은 모두 사라지고 다시 처음부터 렌더링 되게 된다.

<br>

`Link` 컴포넌트를 사용하여 페이지를 전환하면, 페이지를 새로 불러오지 않고 애플리케이션은 그대로 유지한 상태에서 `HTML5 History API`를 사용하여 페이지의 주소만 변경해 준다. `Link` 컴포넌트 자체는 a 태그로 이루어져 있지만, 페이지를 전환을 방지하는 기능이 내장되어 있다.

<br>

**App.js**

```js
import React from 'react';
import { Route, Link } from 'react-router-dom';
import About from './About';
import Home from './Home';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
      </ul>
      <Route path="/" component={Home} exact={true} />
      <Route path={['/about', '/info']} component={About} />
    </div>
  );
};

export default App;
```

다음과 같이 Link 태그의 `to` props를 통해서 경로를 지정해 줄 수 있다. `Route` 안의 `path` props 값에 다음과 같이 배열을 통해 지정하면 하나의 라우터안에 여러 경로의 컴포넌트를 보여줄 수 있다.

<br>

---

### 13.4 URL 파라미터와 쿼리

<br>

페이지 주소를 정의할 때 유동적인 값을 전달해야할 때도 있다. 이는 파라미터와 쿼리로 나눌 수 있다.

파라미터 예시 : **`/profile/yeongjun`**
쿼리 예시 : **`/about?details=true`**

파라미터와 쿼리의 사용에는 무조건 따라야하는 규칙은 없다. 다만 일반적으로 파라미터는 특정 아이디 혹은 이름을 사용하여 조회할 때 사용하고, 쿼리는 우리가 어떤 키워드를 검색하거나 페이지에 필요한 옵션을 전달할 때 사용한다.

<br>

#### URL 파라미터

<br>

**Profile.js**

```js
import React from 'react';

const data = {
  Yeongjun: {
    name: '안영준',
    description: '리액트를 좋아하는 개발자',
  },

  gildong: {
    name: '홍길동',
    description: '고전 소설 홍길동전의 주인공',
  },
};

const Profile = ({ match }) => {
  const { username } = match.params;
  const profile = data[username];

  if (!profile) {
    return <div>존재하지 않는 사용자입니다.</div>;
  }
  return (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
    </div>
  );
};

export default Profile;
```

URL 파라미터를 사용할 때는 라우트로 사용되는 컴포넌트에서 받아오는 `match`라는 객체안의 `params` 값을 참조한다. `match` 객체 안에는 현재 컴포넌트가 어떤 경로 규칙에 의해 보이는지에 대한 정보가 들어 있다.

<br>

**App.js 중 프로필**

```js
<li>
  <Link to="/profile/Yeongjun">yeongjun profile</Link>
</li>
<Route path="/profile/:username" component={Profile} />
```

라우트의 path를 `"/profile/:username"` 다음과 같이 지정하면 `match.params.username` 값을 통해 현재 `username`을 조회할 수 있다.

<br>

#### URL 쿼리

<br>

`About` 페이지에서 쿼리를 받아오도록 한다. 쿼리는 `location` 객체에 들어 있는 `search` 값에서 조회 가능하다. `location` 객체는 라우트로 사용된 컴포넌트에게 props로 전달되며, 웹 애플리케이션의 현재 주소에 대한 정보를 담고 있다.

<br>

**location 객체**

```json
{
  "pathname": "/about",
  "search": "?detail=true",
  "hash": ""
}
```

위 loaction 객체의 값은 `http://localhost:3000/about?detail=true` 주소로 들어갔을 때의 값이다. URL 쿼리는 문자열에 여러 가지 값을 설정해 줄 수 있다. `serach` 값에서 특성 값을 읽어오기 위해서는 이 문자열을 객체 형태로 변환해 주어야 한다.

<br>

쿼리 문자열을 객체로 변환할 때는 qs 라는 라이브러리를 사용한다.

```s
$yarn add qs
```

**About.js**

```js
import React from 'react';
import qs from 'qs';

const About = ({ location }) => {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true, // 이 설정을 통해 문자열 맨 앞의 ?를 생략한다.
  });

  const showDetail = query.detail === 'true'; // 쿼리의 파싱 결과 값은 문자열이다.

  return (
    <div>
      <h1>소개</h1>
      <p>이 프로젝트는 리액트 라우터 기초를 실습해 보는 예제 프로젝트입니다.</p>
      {showDetail && <p>detail 값을 true로 설정하셨군요!</p>}
    </div>
  );
};

export default About;
```

쿼리를 사용할 때는 쿼리 문자열을 객체로 파싱하는 과정에서 결과 값은 언제나 문자열이라는 점을 주의해야 한다. `?value=1` 혹은 `?value=true`와 같이 숫자나 논리 자료형을 사용한다고 해서 해당 값이 우리가 원하는 형태로 변환되는 것이 아니라 `"1"`, `"true"` 와 같이 문자열 형태로 받아진다. 그래서 숫자를 받아와야 한다면 `parseInt` 함수를 사용해서 꼭 숫자로 변환해야 하고, 지금처럼 논리 자료형 값을 사용해야 하는 경우에는 정확히 `"true"` 문자열이랑 일치하는지 비교해야 한다.

브라우저에 http://localhost:3000/about?detail=true 을 입력해서 결과를 확인한다.

<br>

---

### 서브 라우트

서브 라우트는 라우트 내부에서 또 라우트를 정의하는 것을 의미한다. 컴포넌트의 내부에 Rotue 컴포넌트를 또 사용하면 된다. 기존의 App 컴포넌트에서는 두 종류의 프로필 링크를 보여주고 있는데, 이를 잘라내서 프로필 링크를 보여주는 Profiles 라는 라우트 컴포넌트를 따로 만들고, 그 안에서 Profile 컴포넌트를 서브 라우트로 사용하도록 코드를 작성한다.

**Profiles.js**

```js
import React from 'react';
import { Link, Route } from 'react-router-dom';
import Profile from './Profile';

const Profiles = () => {
  return (
    <div>
      <h3>사용자 목록 : </h3>
      <ul>
        <li>
          <Link to="/profiles/Yeongjun">Yeongjun</Link>
        </li>
        <li>
          <Link to="/profiles/gildong">gildong</Link>
        </li>
      </ul>

      <Route
        path="/profiles"
        exact
        render={() => <div>사용자를 선택해 주세요.</div>}
      />
      <Route path="/profiles/:username" component={Profile} />
    </div>
  );
};

export default Profiles;
```

첫 번째 `Route` 컴포넌트에서는 `component` 대신 `render`라는 `props`를 넣어 주었다. 컴포넌트 자체를 전달하는 것이 아니라, 보여주고 싶은 JSX를 넣어줄 수 있다. 지금처럼 따로 컴포넌트를 만들기 애매한 상황에 사용해도 되고, 컴포넌트에 `props`를 별도로 넣어 주고 싶을 때도 사용할 수 있다.

JSX에서 `props`를 설정할 때 생략하면 자동으로 `true`로 설정된다.

<br>

**App.js 프로필**

```js

<li>
  <Link to="/profiles">프로필</Link>
</li>
<Route path="/profiles" component={Profiles} />
```

App.js의 내용을 다음과 같이 고친다.

<br>

---

### 13.6 리액트 라우터 부가 기능

<br>

#### hitory

`history` 객체는 라우트로 사용된 컴포넌트에 `mathch`, `location`과 함께 전달되는 `props` 중 하나로, 이 객체를 통해 컴포넌트 내에 구현하는 메서드에서 라우터 API를 호출할 수 있따. 예를 들어 특정 버튼을 눌렀을 때 뒤로 가거나, 로그인 후 화면을 전환하거나, 다른 페이지로 이탈하는 것을 방지해야할 때 `history`를 활용한다.

**History.js**

```js
import React, { Component } from 'react';

class HistorySample extends Component {
  // 뒤로가기
  handleGoBack = () => {
    this.props.history.goBack();
  };

  // 홈으로 이동
  handleGoHome = () => {
    this.props.history.push('/');
  };

  componentDidMount() {
    // 이것을 설정하고 나면 페이지에 변화가 생기려고 할 때마다 정말 나갈 것인지 질문함
    this.unblock = this.props.history.history.block('정말 떠나실 건가요?');
  }

  componentWillUnmount() {
    // 컴포넌트가 언마운트되면 질문을 멈춤
    if (this.unblock) {
      this.unblock();
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleGoBack}>뒤로</button>
        <button onClick={this.handleGoHome}>홈으로</button>
      </div>
    );
  }
}

export default HistorySample;
```

**App.js history**

```js
<Route path="/history" component={HistorySample}></Route>
```

<br>

#### withRouter

`withRouter` 함수는 `HoC(Higher-order Component)`이다. 라우트로 사용된 컴포넌트가 아니어도 `match, loaction, history` 객체를 접근할 수 있게 해준다.

**withRouterSample.js**

```js
import React from 'react';
import { withRouter } from 'react-router-dom';

const withRouterSample = ({ location, match, history }) => {
  return (
    <div>
      <h4>location</h4>
      <textarea
        value={JSON.stringify(location, null, 2)}
        rows={7}
        readOnly={true}
      />
      <h4>match</h4>
      <textarea
        value={JSON.stringify(match, null, 2)}
        rows={7}
        readOnly={true}
      />

      <button onClick={() => history.push('/')}>홈으로</button>
    </div>
  );
};

export default withRouter(withRouterSample);
```

`withRouter`를 사용할 때는 컴포넌트를 내보내 줄 때 함수로 감싸준다. `JSON.stringify` 두 번째 파라미터와 세 번째 파라미터를 위와 같이 `null, 2`로 설정해 주면 `JSON`에 들여쓰기가 적용된 상태로 문자열이 만들어진다.

<br>

#### Switch

<br>

`Switch` 컴포넌트는 여러 `Route`를 감싸서 그중 일치하는 단 하나의 라우트만 렌더링 시켜준다. `Switch`를 사용하면 모든 규칙과 일치하지 않을 때 보여줄 `Not Found` 페이지도 구현할 수 있다.

**App.js Switch**

```js
<Switch>
  <Route path="/" component={Home} exact={true} />
  <Route path={['/about', '/info']} component={About} />
  <Route path="/profiles" component={Profiles} />
  <Route path="/history" component={HistorySample}></Route>
  <Route
    render={({ location }) => (
      <div>
        <h2>이 페이지는 존재하지 않습니다.</h2>
        <p>{location.pathname}</p>
      </div>
    )}
  />
</Switch>
```

<br>

#### NavLink

<br>

`NavLink`는 `Link`와 비슷하다. 현재 경로와 `Link`에서 사용하는 경로가 일치하는 경우 특정 스타일 혹은 CSS 클래스를 적용할 수 있는 컴포넌트이다.

`NavLink`가 활성화되었을 때의 스타일을 적용할 때는 `activiteStyle` 값을, CSS 클래스를 적용할 때는 `activeClassName` 값을 props로 넣어 주면 된다.

**Profiles.js activeStlye**

```js
const activeStyle = {
  background: 'black',
  color: 'white',
};

<ul>
  <li>
    <NavLink activeStyle={activeStyle} to="/profiles/Yeongjun">
      Yeongjun
    </NavLink>
  </li>
  <li>
    <NavLink activeStyle={activeStyle} to="/profiles/gildong">
      gildong
    </NavLink>
  </li>
</ul>;
```

다음과 같이 `Profiles.js`를 수정하면 사용자 목록에 있는 링크를 클릭했을 때 색상이 검은색, 글자는 하얀색으로 변경된다.

<br>

---

### 13.7 정리

<br>

큰 규모의 프로젝트를 진행하다 보면 한 가지 문제가 발생한다. 바로 웹 브라우저에서 사용할 컴포넌트, 상태 관리를 하는 로직, 그 외 여러 기능을 구현하는 함수들이 점점 쌓이면서 최종 결과물인 자바스크립트의 크기가 매우 커진다는 것이다.

이를 해결하기 위해서는 코드 스플라이팅을 배워야 한다. 다음장에서는 지금까지 배운것을 통해서 뉴스 목록을 보여주는 프로젝트를 만들도록 한다.
