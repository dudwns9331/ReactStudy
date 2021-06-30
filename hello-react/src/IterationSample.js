import React, { useState } from "react";

const IterationSample = () => {
  const [names, setNames] = useState([
    { id: 1, text: "눈사람" },
    { id: 2, text: "얼음" },
    { id: 3, text: "눈" },
    { id: 4, text: "바람" },
  ]);

  const [inputText, setInputText] = useState("");
  const [nextId, setNextId] = useState(5);

  //   const namesList = names.map((name) => <li key={name.id}>{name.text}</li>);

  const onChange = (e) => setInputText(e.target.value);
  const onClick = () => {
    // nextNames 라는 새로운 배열 생성
    const nextNames = names.concat({
      id: nextId,
      text: inputText,
    });

    // nextId의 상태를 +1 한 상태로 새롭게 업데이트 시킨다.
    setNextId(nextId + 1);

    // 생성된 새로운 배열을 names 배열로 상태를 업데이트 시킨다.
    setNames(nextNames);

    // inputText의 값을 "" 빈 문자열로 상태를 업데이트 시킨다.
    setInputText("");
  };

  const onRemove = (id) => {
    const nextNames = names.filter((name) => name.id !== id);
    setNames(nextNames);
  };

  const namesList = names.map((name) => (
    <li ket={name.id} onDoubleClick={() => onRemove(name.id)}>
      {name.text}
    </li>
  ));

  return (
    <>
      <input value={inputText} onChange={onChange} />
      <button onClick={onClick}>추가</button>
      <ul>{namesList}</ul>
    </>
  );
};

export default IterationSample;
