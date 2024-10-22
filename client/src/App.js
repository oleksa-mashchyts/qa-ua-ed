import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CourseList from './components/CourseList';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Header буде відображатись на всіх сторінках */}
        <Header />
        
        <Switch>
          {/* Додаємо маршрут для відображення списку курсів */}
          <Route path="/" exact component={CourseList} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
