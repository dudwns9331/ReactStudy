import React, { useEffect, useState } from "react";

const Info = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  // useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 한다.
  // componentDidMount 와 componentDidUpdate를 합친것과 같음
  useEffect(() => {
    console.log("effect");
    console.log(name);

    return () => {
      console.log("clean up");
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
