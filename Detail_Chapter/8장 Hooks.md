## 2021-07-02

# 8장 Hooks

<br>

Hooks는 리액트 v16.8에 새로 도입된 기능으로 함수형 컴포넌트에서도 상태 관리를 할 수 있는 useState, 렌더링 직후 작업을 설정하는 useEffect 등의 기능을 제공하여 기존의 함수형 컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해준다.

<br>

---

### 8.1 useState

<br>

useState는 가장 기본적인 Hook이며, 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해준다.

Counter.js

```js
import React, { useState } from 'react';

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
```

`const [value, setValue] = useState(0);` 를 통해서 value라는 상태를 사용하고 이를 수정하는 함수는 setValue로 지정하겠다는 뜻이다. `useState(0)` 을 통해서 value의 기본값을 0으로 설정하겠다는 것이다. `setValue()` 안에는 반드시 value를 수정하는 값이 있어야하고 value의 값의 초기화는 0이다.

<br>

Info.js

```js
import React, { useEffect, useState } from 'react';

const Info = () => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  // useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 한다.
  // componentDidMount 와 componentDidUpdate를 합친것과 같음
  useEffect(() => {
    console.log('effect');
    console.log(name);

    return () => {
      console.log('clean up');
      console.log(name);
    };
  }, [name]);

  //   useEffect(() => {
  //       effect
  //       return () => {
  //           cleanup
  //       };
  //   }, [input]);
  // 뒤의 배열에 아무런 값도 넣지 않으면 처음에만 실행된다.
  // 만약 변하는 값에 따라서 호출되게 하려면 배열안에 해당 상태를 넣는다.

  // name의 상태를 업데이트한다. onChangeName이 호출될 때마다
  const onChangeName = (e) => {
    setName(e.target.value);
  };

  // nickname의 상태를 업데이트한다. onChangeNickname이 호출될 때마다
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
        <input value={nickname} onChange={onChangeNickname}></input>
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

`useState` 함수는 하나의 상태 값만 관리할 수 있따. 컴포넌트에서 관리해야 할 상태가 여러 개라며 `useState`를 여러 번 사용하면 된다.

<br>

---

### 8.2 useEffect

<br>

`useEffect`는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정할 수 있는 Hook이다. componentDidMount와 componentDidUpdate를 합친 형태로 보아도 무방하다.

<br>

```js
useEffect(() => {
  console.log('effect');
  console.log(name);

  return () => {
    console.log('clean up');
    console.log(name);
  };
}, [name]);

/*  useEffect(() => {
      effect
      return () => {
          cleanup
      };
  }, [input]);
뒤의 배열에 아무런 값도 넣지 않으면 처음에만 실행된다.
만약 변하는 값에 따라서 호출되게 하려면 배열안에 해당 상태를 넣는다. */
```

`useEffect`에서 설정한 함수를 컴포넌트가 화면에 맨 처음 렌더링될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어 있는 배열을 넣어주면 된다. 특정한 값만 변경될 때 호출하고 싶으면 배열안에 검사하고 싶은 값을 넣으면 된다.

<br>

`useEffect`는 기본적으로 렌더링되고 난 직후마다 실행되며, 두번째 파라미터 배열에 무엇을 넣는지에 따라 실행되는 조건이 달라진다. 컴포넌트가 언마운트되기 전이나 업데이트도기 직전에 어떠한 작업을 수행하고 싶다면 `uesEffect` 에서 뒷정리 함수를 반환하면 된다.

<br>

---

### 8.3 useReducer

<br>

`useReducer`는 `useState`보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook이다. 리듀서는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션 값을 전달받아 새로운 상태를 반환하는 함수이다. 리듀서 함수에서 새로운 상태를 만들 때는 반드시 불변성을 지켜줘야 한다.

<br>

```js
// 리듀서
function reducer(state, action) {
    return { . . . } // 불변성을 지키면서 업데이트한 새로운 상태를 반환한다.
}

// action 값
{
    type : "INCREMENT"
    // 다른 값들이 필요하다면 추가로 들어감
}
```

<br>

CounterReducer

```js
import React, { useReducer } from 'react';

function reducer(state, action) {
  // action.type 에 따라서 다른 작업 수행
  switch (action.type) {
    case 'INCREMENT':
      return { value: state.value + 1 };

    case 'DECREMENT':
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
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
    </div>
  );
};

export default CounterReducer;
```

`useReducer`의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에는 해당 리듀서의 기본값을 넣어준다. 이 Hook을 사용하면 `state` 값과 `dispatch` 함수를 받아온다. 여기서 `state`는 현재 가리키고 있는 상태이고, `dispatch`는 액션을 발생시키는 함수이다.

useReducer를 사용했을 때의 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있다는 것이다.

<br>

InfoReducer.js

```js
import React, { useReducer } from 'react';

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const InfoReducer = () => {
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    nickname: '',
  });

  const { name, nickname } = state;

  const onChange = (e) => {
    dispatch(e.target);
  };

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default InfoReducer;
```

위의 코드는 Reducer를 사용했을 뿐 `Info.js`와 똑같이 작동한다.

<br>

---

### 8.4 useMemo

<br>

`useMemo`를 사용하면 함수형 컴포넌트 내부에서 발생하는 연산을 최적화 할 수 있다.

Average.js

```js
import React, { useState } from 'react';

const getAverage = (numbers) => {
  console.log('평균값 계산 중..');
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState('');

  const onChange = (e) => {
    setNumber(e.target.value);
  };

  const onInsert = (e) => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber('');
  };

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <div>
        <b>평균값: </b>
        {getAverage(list)}
      </div>
    </div>
  );
};

export default Average;
```

`getAverage` 함수를 통해서 평균값을 계산하고 onChange의 값에 따라서 DOM에 입력되는 값을 불러온다. 숫자를 등록하는 것은 `list.concat` 함수를 통해서 입력하고 `map` 함수를 통해서 해당 값을 리스트를 통해서 표현해준다.

인풋 내용이 바뀔 때는 평균값을 다시 계산할 필요가 없는데 렌더링 할때마다 계산하기 때문에 낭비된다. 따라서 `useMemo`를 통해서 계산한다.

<br>

useMemo.js

```js
import React, { useMemo, useState } from 'react';

const getAverage = (numbers) => {
  console.log('평균값 계산 중..');
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const AverageMemo = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState('');

  const onChange = (e) => {
    setNumber(e.target.value);
  };

  const onInsert = (e) => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber('');
  };

  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <div>
        <b>평균값: </b>
        {avg}
      </div>
    </div>
  );
};

export default AverageMemo;
```

`const avg = useMemo(() => getAverage(list), [list]);` 이 코드를 통해서 list의 값이 변경될 때만 getAverage 함수를 호출하여 렌더링을 최소화 한다.

<br>

---

### 8.5 useCallback

<br>

useCallback은 useMemo와 상당히 비슷한 함수이다. 주로 렌더링 성능을 최적화해야 하는 상황에서 사용한다. 컴포넌트의 렌더링이 자주 발생하거나 렌더링해야 할 컴포넌트의 개수가 많아지면 최적화 해주는 것이 좋다.

AverageCallback.js

```js
import React, { useCallback, useMemo, useState } from 'react';

const getAverage = (numbers) => {
  console.log('평균값 계산 중..');
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const AverageCallback = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState('');

  const onChange = useCallback((e) => {
    setNumber(e.target.value);
  }, []); // 컴포넌트가 처음 렌더링될 때만 함수 생성

  const onInsert = useCallback(() => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber('');
  }, [number, list]); // number 혹은 list가 바뀌었을 때만 함수 생성

  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>

      <div>
        <b>평균값: </b>
        {avg}
      </div>
    </div>
  );
};

export default AverageCallback;
```

`useCallback`의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 된다. 이 배열에는 어떤 값이 바뀌었을 때 함수를 새로 생성해야 하는지 명시해야 한다. `onChange` 처럼 비어 있는 배열을 넣게 되면 컴포넌트가 렌더링될 때 만들었던 함수를 계속해서 재사용하게 되며 `onInsert`처럼 배열 안에 `number`와 `list`를 넣게 되면 인풋 내용이 바뀌거나 새로운 항목이 추가될 때 새로 만들어진 함수를 사용하게 된다. 함수 내부에서 상태 값에 의존해야 할 때는 그 값을 반드시 두 번째 파라미터 안에 포함시켜 주어야 한다.

<br>

---

### 8.6 useRef

<br>

`useRef`는 Hook 함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해준다. `useRef`를 사용하여 ref를 설정하면 `useRef`를 통해 만든 객체 안의 `current` 값이 실제 element를 가리키게 된다.

<br>

---

### 8.7 커스텀 Hooks 만들기

<br>

useInputs.js

```js
import { useReducer } from 'react';

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

export default function useInputs(initialForm) {
  const [state, dispatch] = useReducer(reducer, initialForm);
  const onChange = (e) => {
    dispatch(e.target);
  };

  return [state, onChange];
}
```

`Info.js` 에서 사용했던 로직을 자유롭게 짤 수 있다.

<br>

InfoHooks.js

```js
import React from 'react';
import useInputs from './useInputs';

const InfoHooks = () => {
  const [state, onChange] = useInputs({
    name: '',
    nickname: '',
  });

  const { name, nickname } = state;

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b> {name}
        </div>
        <div>
          <b>닉네임:</b> {nickname}
        </div>
      </div>
    </div>
  );
};

export default InfoHooks;
```

`useInputs Hook`을 사용하여 코드는 훨씬 더 간결해진다.

<br>

---

### 8.8 다른 Hooks & 정리

<br>

<p align="center">

<img src="https://github.com/dudwns9331/ReactStudy/blob/master/images/hooks.png" width="400px" height="150px">

</p>

<br>

다른 개발자들이 만든 Hooks도 라이브러리로 설치하여 사용 가능하다.

예시 Hooks

https://nikgraf.github.io/react-hooks/
<br>
https://github.com/rehooks/awesome-react-hooks

리액트에서는 Hooks 패턴을 사용하면 클래스형 컴포넌트를 작성하지 않고도 대부분의 기능을 구현할 수 있다. 리액트 매뉴얼에 따르면 기존의 클래스형 컴포넌트는 앞으로도 계속 지원될 예정이다. 앞으로의 프로젝트에서는 함수형 컴포넌트의 사용을 첫 번째 옵션으로 두고, 꼭 필요한 상황에서만 클래스형 컴포넌트를 구현하도록 한다.
