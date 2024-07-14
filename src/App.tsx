import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './store/store.ts';
import { VisaStatusManagement } from './components/VisaStatusManagement.tsx';
import './App.css';

export const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/visa-status" element={<VisaStatusManagement />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
