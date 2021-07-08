## 2021-07-08

# 12장 immer를 사용하여 더 쉽게 불변성 유지하기

<br>

11장에서는 컴포넌트 업데이트 성능을 어떻게 최적화해야 하는지, 불변성을 유지하면서 상태를 업데이트하는 것이 왜 중요한지 배웠다. 전개 연산자와 배열 내장 함수를 사용하면 간단하게 배열 혹은 객체를 복사하고 새로운 값을 덮어 쓸 수 있었다. 하지만 객체의 구조가 엄청나게 깊어지면 불변성을 유지하면서 업데이트하는 것이 매우 힘들다.

<br>

실제 프로젝트에서도 복잡한 상태를 다룰 때가 있는데 그럴 때마다 전개 연산자를 사용하여 업데이트 해주면 번거로운 점이 발생할 수 있다. 이럴때 `immer`라는 라이브러리를 사용하면 불변성을 유지하면서 업데이트해 줄 수 있다.

<br>

---

### 12.1 immer를 설치하고 사용법 알아보기

<br>

```s
$yarn create react-app immer-tutorial
$cd immer-tutorial
$yarn add immer
```

다음과같이 `immer-tutorial` 앱을 만들고 거기에 `immer` 라이브러리를 설치하도록 한다.

<br>

다음은 `immer` 라이브러리를 이용해서 불변성을 유지하면서 배열을 업데이트하는 예제를 작성하도록 한다.

**App.js**

```js
import { useCallback, useRef, useState } from 'react';
import './App.css';
import produce from 'immer';

function App() {
  // ID의 값을 지정한다.
  const nextId = useRef(1);
  // form 상태와 form의 상태값을 업데이트하는 변수를 useState를 통해서 작성한다. 상태 : name, username
  const [form, setForm] = useState({ name: '', username: '' });
  // 리스트에 표시되는 data 배열 상태를 선언하도록 한다.
  const [data, setData] = useState({
    array: [],
    uselessValue: null,
  });

  // input 수정을 위한 함수
  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(
      produce((draft) => {
        draft[name] = value;
      })
    );
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const info = {
        id: nextId.current,
        name: form.name,
        username: form.username,
      };

      // array에 새 항목 등록
      setData(
        produce((draft) => {
          draft.array.push(info);
        })
      );

      setForm({
        name: '',
        username: '',
      });
      nextId.current += 1;
    },
    [form.name, form.username]
  );

  // 항목을 삭제하는 함수

  const onRemove = useCallback((id) => {
    setData(
      produce((draft) => {
        draft.array.splice(
          draft.array.findIndex((info) => info.id === id),
          1
        );
      })
    );
  }, []);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>

      <div>
        <ul>
          {data.array.map((info) => (
            <li key={info.id} onClick={() => onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
```

`immer에서 제공하는 produce 함수를 호출할 때, 첫 번째 파라미터가 함수 형태라면 업데이트 함수를 반환한다.`

`immer`를 사용하면 불변성을 유지하는 작업은 매우 간단하게 처리 가능하다. `produce`라는 함수는 두 가지 파라미터를 받는다. 첫 번째 파라미터는 수정하고 싶은 상태이고, 두 번째 파라미터는 상태를 어떻게 업데이트할지 정의하는 함수이다.

**ExampleImmer**

```js
import from 'immer';
const nextState = produce(originalState, draft => {
    // 바꾸고 싶은 값 바꾸기
    draft.somewhere.deep.inside = 5;
})
```

두 번째 파라미터로 전달되는 함수 내부에서 원하는 값을 변경하면, `produce` 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성해 준다.

이 라이브러리의 `핵심은 불변성에 신경쓰지 않는 것처럼 코드를 작성하되 불변성 관리는 제대로 해 주는 것`이다.

<br>

배열의 직접적인 변화를 일으키는 push, splice 등의 함수를 사용해도 무방하다. immer를 사용한다고 해서 무조건 코드가 간결해지지는 않는다. onRemove의 경우에는 배열 내장 함수 filter를 사용하는 것이 코드가 더 깔끔하다. `immer는 불변성을 유지하는 코드가 복잡할 때만 사용해도 충분하다.`
