import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleLoginClick = () => {
    setActiveTab('login');
    window.scrollTo(0, 0);
  };

  const handleSignupClick = () => {
    setActiveTab('register');
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activeTab === 'register' || activeTab === 'login') {
      return activeTab === 'register' ? <Register setActiveTab={setActiveTab} /> : <Login setActiveTab={setActiveTab} />;
    }
    
    return (
      <>
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
        />
        <main className="main-content">
          {(() => {
            switch (activeTab) {
              case 'home':
                return <Home setActiveTab={setActiveTab} />;
              case 'about':
                return <About />;
              case 'features':
                return <Features />;
              default:
                return <Home setActiveTab={setActiveTab} />;
            }
          })()}
        </main>
        <Footer setActiveTab={setActiveTab} />
      </>
    );
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;
