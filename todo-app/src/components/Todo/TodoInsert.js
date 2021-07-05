import React, { useCallback, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import 'components/Scss/TodoInsert.scss';

const TodoInsert = ({ onInsert }) => {
  const [value, setValue] = useState('');

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      if (value !== '') {
        onInsert(value);
        setValue(''); // value 값 초기화
      } else {
        alert('할 일을 입력하세요');
        setValue(''); // value 값 초기화
      }
      // submit 이벤트는 브라우저에서 새로고침을 발생시킨다.
      // 이를 방지하기 위해 이 함수를 호출한다.
      e.preventDefault();
    },
    [onInsert, value],
  );

  return (
    // onSubmit은 input안에 내용을 넣고 엔터만 치더라도 발생되기 때문에
    // 버튼에 onClick을 넣지 않고 form에 onSubmit 해준다.
    <form className="TodoInsert" onSubmit={onSubmit}>
      <input
        placeholder="할 일을 입력하세요"
        value={value}
        onChange={onChange}
      />
      <button type="submit">
        <MdAdd />
      </button>
    </form>
  );
};

export default TodoInsert;
