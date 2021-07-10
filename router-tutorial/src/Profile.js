import React from 'react';
import WithRouterSample from './WithRouterSample';

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

// match는 Route에서 받아오는 객체이다.
const Profile = ({ match }) => {
  const { username } = match.params;
  const profile = data[username];
  // username = Yeongjun
  // profile.name = 안영준

  if (!profile) {
    return <div>존재하지 않는 사용자입니다.</div>;
  }
  return (
    <div>
      <h3>
        {username}({profile.name})
      </h3>
      <p>{profile.description}</p>
      <WithRouterSample />
    </div>
  );
};

export default Profile;
