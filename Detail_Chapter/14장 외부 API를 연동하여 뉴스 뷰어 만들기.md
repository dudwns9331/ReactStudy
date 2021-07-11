## 2021-07-11

# 14장 외부 API를 연동하여 뉴스 뷰어 만들기

지금까지 배운 것을 활용하여 카테고리별로 최신 뉴스 목록을 보여주는 뉴스 뷰어 프로젝트를 진행하도록 한다. https://newsapi.org/ 에서 제공하는 API를 활용하여 데이터를 받아오고, 9장에서 배운 styled-component를 활용하여 프로젝트를 스타일링 하도록 한다.

<br>

### 14.1 비동기 작업의 이해

<br>

웹 애플리케이션을 만들다 보면 처리할 때 시간이 걸리는 작업이 있다. 에를 들어 웹 애플리케이션에서 서버 쪽 데이터가 필요할 때는 Ajax 기법을 사용하여 서버의 API를 호출함으로써 데이터를 수신한다. 이렇게 서버에의 API를 사용해야 할 때는 네트워크 송수신 과정에서 시간이 걸리기 때문에 작업이 즉시 처리되는 것이 아니라, 응답을 받을 때까지 기다렸다가 전달받은 응답 데이터를 처리한다. 이 과정에서 해당 작업을 `비동기적`으로 처리하게 된다.

[동기처리 비동기처리 in JavaScrpit MDN 설명 바로가기](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Asynchronous/Introducing)

<br>

<p align="center">

<img src="https://github.com/dudwns9331/ReactStudy/blob/master/images/synchoronous.png" width="500px" height="295px">

</p>

만약 작업을 동기적으로 처리한다면 요청이 끝날 때까지 기다리는 동안 중지 상태가 되기 때문에 다른 작업을 할 수 없다. 하지만 이를 비동기적으로 처리한다면 웹 애플리케이션이 멈추지 않기 떄문에 동시에 여러 가지 요청을 처리할 수도 있고, 기다리는 과정에서 다른 함수도 호출할 수 있다.

서버 API를 호출할 때 외에도 작업을 비동기적으로 처리할 때가 있는데, 바로 `setTimeout` 함수를 사용하여 특정 작업을 예약할 때이다.

**setTimeout Example**

**title.js**

```js
function printMe() {
  console.log('hello world');
}

setTimeout(printMe, 3000);
console.log('대기 중...');
```

setTimeout이 사용되는 시점에서 코드가 3초 동안 멈추는 것이 아니라, 일단 코드가 위부터 아래가지 다 호출되고 3초 뒤에 우리가 지정한 printMe 가 호출된다.

자바스크립트를에서 비동기 작업을 할 때 가장 흔히 사용하는 방법은 콜백 함수를 사용하는 것이다. 위 코드에서 printMe 함가 3초뒤 호출되도록 printMe 함수 자체를 setTimeout 함수의 인자로 전달해 주었는데, 이런 함수를 `콜백 함수` 라고 한다.

<br>

파라미터 값이 주어지면 1초 뒤에 10을 더해서 반환하는 함수를 통해서 콜백함수의 예시를 살펴보도록 한다.

**Callback Example**

```js
function increase(number, callback) {
  setTimeout(() => {
    const result = number + 10;
    if (callback) {
      callback(result);
    }
  }, 1000);
}

increase(0, (result) => {
  console.log(result);
});
```

1초에 걸쳐서 10, 20, 30, 40 과 같은 혀앹로 여러 번 순차적으로 처리하고 싶다면 콜백 함수를 중첩하여 구현할 수 있다.

**Callback hell Example**

```js
function increase(number, callback) {
  setTimeout(() => {
    const result = number + 10;
    if (callback) {
      callback(result);
    }
  }, 1000);
}

console.log('작업 시작');
increase(result, (result) => {
  console.log(result);
  increase(result, (result) => {
    console.log(result);
    increase(result, (result) => {
      console.log(result);
      increase(result, (result) => {
        console.log(result);
      });
    });
  });
});
```

콜백 안에 또 콜백을 넣어서 구현할 수 있는데 너무 여러 번 중첩되니까 코드의 가독성이 나빠진다. 이런한 형태의 코드를 `'콜백 지옥'` 이라고 한다. 웨만하면 지양해야 할 형태의 코드다.

<br>

`Promise`는 콜백 지옥 같은 코드가 형성되지 않게 하는 방안으로 ES6에 도입된 기능이다.

**Promise Example**

```js
function increase(number) {
  const promise = new Promise((resolve, reject) => {
    // resolve는 성공, reject는 실패
    setTimeout(() => {
      const result = number + 10;
      if (result > 50) {
        // 50보다 높으면 에러 발생시키기
        const e = new Error('NumberTooBig');
        return reject(e);
      }
      resolve(result); // number 값에 + 10 후 성공 처리
    }, 1000);
  });
  return promise;
}

increase(0)
  .then((number) => {
    // Promise에서 resolve된 값은 .then을 통해 받아 올 수 있음
    console.log(number);
    return increase(number); // Promise를 리턴
  })
  .then((number) => {
    console.log(number);
    return increase(number); // Promise를 리턴
  })
  .then((number) => {
    console.log(number);
    return increase(number); // Promise를 리턴
  })
  .then((number) => {
    console.log(number);
    return increase(number); // Promise를 리턴
  })
  .then((number) => {
    console.log(number);
    return increase(number); // Promise를 리턴
  })
  .catch((e) => {
    // 도중에 에러가 발생하면 .catch를 통해서 알 수 있음
    console.log(e);
  });
```

여러 작업을 연달아 처리한다고 해서 함수를 여러 번 감싸는 것이 아니라 `.then`을 통해서 그다음 작업을 설정하기 때문에 콜백 지옥이 형성되지 않는다.

<br>

`async/await`는 `Promise`를 더욱 쉽게 사용할 수 있도록 해 주는 ES8(ES2017) 문법이다. 이 문법을 사용하려면 함수의 앞 부분에 async 키워드를 추가하고, 해당 함수 내부에서 Promise 앞부분에 await 키워드를 사용한다. 이렇게하면 Promise가 끝날 때까지 기다리고, 결과 값을 특정 변수에 담을 수 있다.

**async/await Example**

```js
function increase(number) {
  const promise = new Promise((resolve, reject) => {
    // resolve는 성공, reject는 실패
    setTimeout(() => {
      const result = number + 10;
      if (result > 50) {
        // 50보다 높으면 에러 발생시키기
        const e = new Error('NumberTooBig');
        return reject(e);
      }
      resolve(result); // number 값에 + 10 후 성공 처리
    }, 1000);
  });
  return promise;
}

async function runTasks() {
    try { // try catch 구문을 사용하여 에러를 처리한다.
        let result = await.increase(0);
        console.log(result);
        result = await.increase(result);
        console.log(result);
        result = await.increase(result);
        console.log(result);
        result = await.increase(result);
        console.log(result);
        result = await.increase(result);
        console.log(result);
        result = await.increase(result);
        console.log(result);
    } catch(e) {
        console.log(e);
    }
}
```

<br>

---

### 14.2 axios로 API 호출해서 데이터 받아오기

axios는 현재 가장 많이 사용되고 있는 자바스크리브 HTTP 클라이언트이다. 이 라이브러리의 특징은 HTTP 요청을 Promise 기반으로 처리한다는 점이다.

**App.js axios**

```js
import React, { useState } from 'react';
import axios from '../node_modules/axios/index';

const App = () => {
  const [data, setData] = useState(null);
  const onClick = async () => {
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos/1'
      );
      setData(response.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea
          rows={7}
          value={JSON.stringify(data, null, 2)}
          readOnly={true}
        ></textarea>
      )}
    </div>
  );
};
```

불러오기 버튼을 누르면 `JSONPlaceholder`에서 제공하는 가짜 API를 호출하고 이에 대한 응답을 컴포넌트 상태에 넣어서 보여주는 예제이다.

`axios.get` 함수를 사용했고, 이 함수는 파라미터로 전달된 주소에 `GET` 요청을 해준다. 그리고 이에 대한 결과는 `.then` 을 통해서 비동기적으로 확인할 수 있다.

`async/await`를 적용할 때는 `async () => {}` 와 같은 형식으로 적용한다.

<br>

---

### 14.3 newsapi API 키 발급받기

<br>

newsapi에서 제공하는 API를 사용하여 최신 뉴스를 불러온 후 보여준다.

[news-api 가입하고 apikey 발급받기](https://newsapi.org/register) 를 통해서 apikey를 발급 받도록 한다.

<br>

<p align="center">

<img src="https://github.com/dudwns9331/ReactStudy/blob/master/images/news-api.png" width="500px" height="295px">

</p>

[뉴스 api 사용방법](https://newsapi.org/s/south-korea-news-api) 다음 링크를 통해서 한국 뉴스를 가져오는 API에 대한 설명서가 있다.

사용할 API 주소는 두 가지 형태이다.

1. 전체 뉴스 불러오기

- GET https://newsapi.org/v2/top-headlines?country=kr&apiKey= 발급 받은 키 주소

2. 특정 카테고리 뉴스 불러오기

- GET https://newsapi.org/v2/top-headlines?country=kr&category=business&apiKey= 발급 받은 키 주소

여기서 카테고리는 business, entertainment, health, science, sports, technology 중에 골라서 사용 가능하다. 카테고리를 생략하면 모든 뉴스 카테고리의 뉴스를 불러온다. apikey 값에는 발급 받은 API 키를 입력하도록 한다.

전체 뉴스를 불러오는 API 주소를 response에 값이 들어가도록 `App.js`를 수정한다.

<br>

---

### 14.4 뉴스 뷰어 UI 만들기

<br>

styled-component를 사용하여 뉴스 정보를 보여 줄 컴포넌트를 만들도록 한다.

```s
$yarn add styled-components
```

`NewsItem.js`와 `NewsList.js` 파일을 생성하도록 한다. NewsList는 API를 요청하고 뉴스 데이터가 들어 있는 배열을 컴포넌트 배열로 변환하여 렌더링해 주는 컴포넌트이다.

NewsItem 컴포넌트 코드를 작성하도록 한다. 뉴스 데이터에 어떤 필드가 있는지 확인한다.

**api.json**

```json
{
  "articles": [
      "source": {
        "id": null,
        "name": "Joins.com"
      },
      "author": "나운채",
      "title": "이인영 “젠더 감수성 이상해”…이준석 “인권 감수성 키워라” - 중앙일보 - 중앙일보 모바일",
      "description": "이 대표는 지난 10일 자신의 SNS에 지난 3월8일 세계 여성의 날을 맞아 이 장관이 부처 여성 공무원들에게 꽃을 건네는 통일부의 유튜브 영상을 공유하며 \"농담이지만 통일부는 유튜브 채널도 재미없다\"며 \"장관이 직원에게 꽃 주는 영상 편집할 돈, 이거 다 국민의 세금\"이라고 지적했다. 이 장관의 글에 이 대표는 11일 S - 이인영,통일부,통일부장관,이준석,국민의힘,당대표,여성가족부,젠더,인권,감수성,소셜네트워크서비스,SNS,설전",
      "url": "https://mnews.joins.com/article/24102866",
      "urlToImage": "https://pds.joins.com/news/component/htmlphoto_mmdata/202107/11/abfd3678-6764-4c88-95c0-7c6b0e320afc.jpg",
      "publishedAt": "2021-07-11T06:35:03Z",
      "content": "() . , 1\r\n· · (SNS) . 10 SNS 38 , . , . SNS , . . \r\n   11 SNS . , UN( ) . , . , , .  ( ) , ."
    },
    {
      "source": {
        "id": null,
        "name": "Ohmynews.com"
      },
      "author": null,
      "title": "일 매체 \"한일, 도쿄올림픽 즈음 정상회담 조율 중\" - 오마이뉴스",
      "description": "닛케이 신문 &quot;일본이 한국 요구 수용&quot; 보도... 짧게 의례적 회담 그칠 가능성도 전해",
      "url": "http://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002758296",
      "urlToImage": "http://ojsfile.ohmynews.com/CRI_T_IMG/2021/0711/A0002758296_T.jpg",
      "publishedAt": "2021-07-11T06:35:00Z",
      "content": null
    },
  ]
```

- title : 제목
- description : 내용
- url: 링크
- urlToImage: 뉴스 이미지

NewsItem 컴포넌트는 article이라는 객체를 props로 통째로 받아 와서 사용한다.

<br>

**NewsItem.js**

```js
import React from 'react';
import styled from 'styled-components';

const NewsItemBlock = styled.div`
  display: flex;
  .thumbnail {
    margin-right: 1rem;
    img {
      display: block;
      width: 160px;
      height: 100px;
      object-fit: cover;
    }
  }

  .contents {
    h2 {
      margin: 0;
      a {
        color: black;
      }
    }
    p {
      margin: 0;
      line-height: 1.5;
      margin-top: 0.5rem;
      white-space: normal;
    }
  }
  & + & {
    margin-top: 3rem;
  }
`;

const NewsItem = ({ article }) => {
  const { title, description, url, urlToImage } = article;

  return (
    <NewsItemBlock>
      {urlToImage && (
        <div className="thumbnail">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <img src={urlToImage} alt="thumbnail" />
          </a>
        </div>
      )}
      <div className="contents">
        <h2>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h2>
        <p>{description}</p>
      </div>
    </NewsItemBlock>
  );
};

export default NewsItem;
```

`<a>` 에 사용된 `rel="noopener noreferrer"` 는 window.opener의 악의적인 사용을 방지하는 것을 고려하기 위해 사용한다.

<br>

**NewsList.js**

```js
import React from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const sampleArticle = {
  title: '제목',
  description: '내용',
  url: 'https://google.com',
  urlToImage: 'https://via.placeholder.com/160',
};

const NewsList = () => {
  return (
    <div>
      <NewsListBlock>
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
        <NewsItem article={sampleArticle} />
      </NewsListBlock>
    </div>
  );
};

export default NewsList;
```

나중에 이 컴포넌트에서 API를 요청하게 될 텐데, 지금은 아직 데이터를 불러오지 않고 있으니 `sampleArticle`이라는 객체에 미리 예시 데이터를 넣은 후 각 컴포넌트에 전달하여 가짜 내용이 보이게 한다.

<br>

---

### 14.5 데이터 연동하기

<br>

이제 `NewsList` 컴포넌트에서 API 호출을 하도록 한다. 컴포넌트가 화면에 보이는 시점에 API를 요청하는데, 이때 `useEffect`를 사용하여 컴포넌트가 처름 렌더링되는 시점에 API를 요청한다. 여기서 주의할 점은 `useEffect`에 등록하는 함수에 async를 붙이면 안된다는 것이다. `useEffect`는 반환해야 하는 값은 뒷정리 함수이기 때문이다.

따라서 `useEffect` 내부에서 `async/await`를 사용하고 싶다면, 함수 내부에서 `async` 키워드가 붙은 또 다른 함수를 만들어서 사용해 주어야 한다.

추가로 `loading`이라는 상태도 관리하여 API 요청이 대기 중인지 판별한다. 요청이 대기중일 때는 `loading` 값이 `true`가 되고, 요청이 끝나면 `loading` 값이 `false`가 된다.

<br>

**components/NewsList.js**

```js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsItem from './NewsItem';
import axios from 'axios';

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'https://newsapi.org/v2/top-headlines?country=kr&apiKey=c42ec5e37b4445d1a9d538a1104dba72'
        );
        setArticles(response.data.articles);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // 대기 중일 때
  if (loading) {
    return <NewsListBlock>대기 중 . . .</NewsListBlock>;
  }

  // 아직 articles 값이 설정되지 않았을 때
  if (!articles) {
    return null;
  }

  // articles 값이 유효할 때
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
```

데이터를 불러와서 뉴스 데이터 배열을 `map` 함수를 사용하여 컴포넌트 배열로 변환할 때 신경써야 하는 부분이 있다. `map` 함수를 사용하기 전에 꼭 `!articles`를 조회하여 해당 값이 현재 `null`이 아닌지 검사해야 한다. 이 작업을 하지 않으면, 아직 데이터가 없을 때 `null`에는 `map` 함수가 없기 때문에 렌더링 과정에서 오류가발생한다. 그래서 애플리케이션이 제대로 나타나지 않고 흰 화면이 보이게 된다.

---

<br>

### 14.6 카테고리 기능 구현하기

<br>

이번에는 뉴스의 카테고리 선택 기능을 구현하도록 한다. 뉴스 카테고리는 총 여섯 개이며, 다음과 같이 영어로 되어 있다.

- business, entertainment, health, science, sports, technology

해당 값을 이용해서 화면에 카테고리를 보여줄 때는 영어로 된 값을 그대로 보여 주지 않고, 다음 그림처럼 한글로 보여 준 뒤 클릭 했을 때는 영어로 된 카테고리 값을 구현하도록 한다.

먼저 `components` 디렉터리에 `Categories.js` 컴포넌트 파일을 생성하여 코드를 작성한다.

**components/Categories**

```js
import React from 'react';
import styled from 'styled-components';

const categories = [
  {
    name: 'all',
    text: '전체보기',
  },
  {
    name: 'business',
    text: '비즈니스',
  },
  {
    name: 'entertainment',
    text: '엔터테인먼트',
  },
  {
    name: 'health',
    text: '건강',
  },
  {
    name: 'science',
    text: '과학',
  },
  {
    name: 'sports',
    text: ' 스포츠',
  },
  {
    name: 'technology',
    text: '기술',
  },
];

const CategoriesBlock = styled.div`
  display: flex;
  padding: 1rem;
  width: 768px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Category = styled.div`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  & + & {
    margin-left: 1rem;
  }
`;

const Categories = () => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category key={c.name}>{c.text}</Category>
      ))}
    </CategoriesBlock>
  );
};

export default Categories;
```

위 코드는 `categories`라는 배열 안에 `name`과 `text` 값이 들어가 있는 객체들을 넣어 주어서 한 글로 된 카테고리와 실제 카테고리 값을 연결시켜 주었다. 여기서 `name`은 실제 카테고리 값을 가리키고, `text` 값은 렌더일할 때 사용할 한글 카테고리를 가리킨다.

<br>

**App.js 상태관리**

```js
import React, { useState, useCallback } from 'react';
import NewsList from 'components/NewsList';
import Categories from 'components/Categories';

const App = () => {
  const [category, setCategory] = useState('all');
  const onSelect = useCallback((category) => setCategory(category), []);

  return (
    <>
      <Categories category={category} onSelect={onSelect} />
      <NewsList category={category} />
    </>
  );
};

export default App;
```

App에서 category 상태를 useState로 관리하도록 한다. 추가로 category 값을 업데이트하는 onSelect라는 함수도 만들어 주도록 한다. 그리고 나서 category와 onSelect 함수를 Categories라는 컴포넌트에게 props로 전달한다.

**카테고리 꾸미기**

```js
 ${(props) =>
    props.active &&
    css`
      font-weight: 600;
      border-bottom: 2px solid #22b8cf;
      color: #22b8cf;
      $:hover {
        color: #3bc9db;
      }
    `}

const Categories = ({ category, onSelect }) => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          active={category === c.name}
          onClick={() => onSelect(c.name)}
        >
          {c.text}
        </Category>
      ))}
    </CategoriesBlock>
  );
};

```

다음 코드를 Category 변수에 추가해 주도록 한다. 그리고 Categories는 수정해준다.

<br>

직므은 뉴스 API를 요청할 때 따로 카테로기를 선택하지 않고 뉴스 목록을 불러오고 있다. NewsList 컴포넌트에서 현재 props로 받아온 category에 따라 카테고리를 지정하여 API를 요청하도록 구현한다.

**components/NewsList.js useEffect 수정**

```js
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const query = category === 'all' ? '' : `&category=${category}`;
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=c42ec5e37b4445d1a9d538a1104dba72`
      );
      setArticles(response.data.articles);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  fetchData();
}, [category]);
```

현재 `category` 값이 무엇인지에 따라 요청할 주소가 동적으로 바뀌고 있다. `category` 값이 `all` 이라면 `query` 값을 공백으로 설정하고, `all`이 아니라면 `"&category=카테고리"` 형태의 문자열을 만들도록 했다. 그리고 이 `query`를 요청할 대 주소에 포함시켜 주었다.

추가로 `category` 값이 바뀔 때마다 뉴스를 새로 불러와야 하기 때문에 `useEffect`의 의존 배열(두번째 파라미터로 설정하는 배열)에 `category`를 넣어줘야 한다.

---

<br>

### 14.7 리액트 라우터 적용하기

<br>

카테고리의 값을 `useState`로 관리했었는데, 이번에는 이 값을 리액트 라우터의 URL 파라미터를 사용해서 관리해보도록 하겠다.

이번 프로젝트에 리액트 라우터를 적용할 때 만들어야 할 페이지는 단 하나다. src 디렉터리에 `pages` 라는 디렉터리를 생성하고, 그 안에 `NewsPage.js` 파일을 만든다.

**pages/NewsPage.js**

```js
import Categories from 'components/Categories';
import NewsList from 'components/NewsList';
import React from 'react';

const NewsPage = ({ match }) => {
  const category = match.params.category || 'all';

  return (
    <>
      <Categories />
      <NewsList category={category} />
    </>
  );
};

export default NewsPage;
```

현재 선택된 `category` 값을 URL 파라미터를 통해 사용할 것이므로 `Categories` 컴포넌트에서 현재 선택된 카테고리 값을 알려 줄 필요도 없고, `onSelect` 함수를 따로 전해 줄 필요도 없다.

**app.js 라우터**

```js
import React from 'react';
import NewsPage from 'pages/NewsPage';
import { Route } from 'react-router-dom';

const App = () => {
  return <Route path="/:category?" component={NewsPage} />;
};

export default App;
```

위 코드에서 사용된 `path에 /:category?` 와 같은 형태로 맨 뒤에 물음표 문자가 들어가 있는데, 이는 `category` 값이 선택적이라는 의미이다. 즉, 있을 수 도 있고 없을 수도 있다는 뜻이다. `category` URL 파라미터가 없으면 전체 카테고리를 선택한 것으로 간주한다.

이제 `Categories`에서 기존의 `onSelect` 함수를 호출하여 카테고리르 선택하고, 선택된 카테고리에 다른 스타일을 주는 기능을 `NavLink`로 대체한다. `div, a, button, input` 처럼 일반 HTML 요소가 아닌 특정 컴포넌트에 `styled-components`를 사용할 때는 `styled(컴포넌트이름)` 과 같은 형식을 쓴다.

**components/Categories.js NavLink 설정**

```js
const Category = styled(NavLink)`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  &:hover {
    color: #495057;
  }

  &.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }

  & + & {
    margin-left: 1rem;
  }
`;

const Categories = ({ category, onSelect }) => {
  return (
    <CategoriesBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          activeClassName="active"
          exact={c.name === 'all'}
          to={c.name === 'all' ? '/' : `/${c.name}`}
        >
          {c.text}
        </Category>
      ))}
    </CategoriesBlock>
  );
};
```

`NavLink` 로 만들어진 `Category` 컴포넌트에 `to` 값은 `"/카테고리이름"` 으로 설정했다. 그리고 카테고리 중에서 전체보기의 경우는 예외로 `"/all"` 대신에 `"/"` 로 설정했다. `to` 값이 `"/"` 을 가리키고 있을 때는 `exact` 값을 `true` 로 주어야 한다. 이 값을 설정하지 않으면 다른 카테고리가 선택되었을 때도 전체보기 링크에 `active` 스타일이 적용되는 오류가 발생한다.

<br>

---

### 14.8 usePromise 커스텀 Hook 만들기

<br>

컴포넌트에서 API 호출처럼 `Promise` 를 사용해야 하는 경우 더욱 간결하게 코드를 작성할 수 있도록 해주는 커스텀 Hook을 만들어 보도록 하겠다. Hook의 이름은 `usePromise` 이고 `src/lib` 를 만들고 그 안에 `usePromise.js` 를 만들도록 한다.

**lib/usePromise.js**

```js
import { useState, useEffect } from 'react';

export default function usePromise(promiseCreator, deps) {
  // 대기 중/완료/실패 대한 상태 관리
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [loading, resolved, error];
}
```

프로젝트의 다양한 곳에서 사용될 수 있는 유틸 함수들은 보통 이렇게 src 디렉터리의 lib 디렉터리를 만든 후 사용한다.

`usePromise` Hook은 `Promise` 의 대기 중, 완료 결과, 실패 결과에 대한 상태를 관리하며, `usePromise`의 의존 배열 deps를 파라미터로 받아온다. 파라미터로 받아 온 deps 배열은 `usePromise` 내부에서 사용한 `useEffect` 의 의존 배열로 설정되는데, 이 배열을 설정한느 부분에서 ESLint 경고가 나온다.

**components/NewsList.js usePromise 사용**

```js
const NewsList = ({ category }) => {
  const [loading, response, error] = usePromise(() => {
    const query = category === 'all' ? '' : `&category=${category}`;
    return axios.get(
      `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=c42ec5e37b4445d1a9d538a1104dba72`
    );
  }, [category]);

  // 대기 중일 때
  if (loading) {
    return <NewsListBlock>대기 중 . . .</NewsListBlock>;
  }

  // 아직 response 값이 설정되지 않았을 때
  if (!response) {
    return null;
  }

  // 에러 발생 시
  if (error) {
    return <NewsListBlock> 에러 발생 ! </NewsListBlock>;
  }

  const { articles } = response.data;
  return (
    <NewsListBlock>
      {articles.map((article) => (
        <NewsItem key={article.url} article={article} />
      ))}
    </NewsListBlock>
  );
};
```

usePromise를 사용하면 NewsList에서 대기 중 상태 관리와 useEffect 설정을 직접 하지 않아도 되므로 코드가 훨씩 간결해진다. 요청 상태를 관리할 때 무조건 커스텀 Hook을 만들어서 사용해야 하는건 아니지만, 상황에 따라 적절히 사용하면 좋은 코드를 만들어 갈 수 있다.

---

### 14.9 정리

<br>

외부 API를 연동하여 사용하는 방법을 알아보고, 지금까지 배운 것을 활용하여 실제로 쓸모 있는 프로젝트를 개발해 보았다. 리액트 컴포넌트에서 API를 연동하여 개발할 때 절대 잊지 말아야 할 유의 사항은 `useEffect` 에 등록하는 함수는 `async` 로 작성하면 안 된다는 점이다. 그 대신 함수 내부에 `async` 함수를 따로 만들어 주어야 한다.

지금은 `usePromise` 라는 커스텀 Hook을 만들어 사용함으로써 코드가 조금 간결해지기는 했지만, 나중에 사용해야할 API의 종류가 많아지면 요청을 위한 상태 관리를 하는 것이 번거러워 질 수 있다. 뒤에 나올 `리덕스와 리덕스 미들웨어`를 배우면 좀 더 쉽게 요청에 대한 상태를 관리할 수 있다.
