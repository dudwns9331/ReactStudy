import React from 'react';
import NewsPage from 'pages/NewsPage';
import { Route } from 'react-router-dom';

const App = () => {
  return <Route path="/:category?" component={NewsPage} />;
};

export default App;
