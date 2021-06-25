import React from "react";

const MyComponent = ({ name, children }) => {
  return (
    <div>
      안녕하세요, 제 이름은 {name} 입니다. <br />
      태그 안의 내용 값은 {children} 입니다.
    </div>
  );
};

export default MyComponent;
