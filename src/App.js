import React from 'react';
import socket from './socket';
import Login from './components/Login';
import Chat from './components/Chat'
import Registration from './components/Registation';

function App() {
  const [islogged, setIsLogged] = React.useState(false); //состояние выполненой авторизации
  const [registration, setRegistration] = React.useState(false); //состояние открытой регистрации
  const [currentUser, setCurrentUser] = React.useState(null); //состояние с информацией о текущем пользователе
  
  //Хук, выполняющий вложенную функцию при каждом обновлении состояний компонента
  React.useEffect(() => {
    //событие получения запроса
    socket.on('LOGIN:YES', (user) => {
      setCurrentUser(user); //изменение состояния currentUser, присвоение ему переданного значения
      setIsLogged(true); //изменение состояния isLogged
    });
    socket.on('LOGIN:NO', () => {
      alert("Incorrect login or password!"); //вывод уведомления в браузер
    });
    socket.on('REG:YES', () => {
      setRegistration(false); //изменение состояния registration
    });
    socket.on('REG:NO', () => {
      alert("User already exists!"); //вывод уведомления в браузер
    });
  }, []);
  
  const onLogin = (obj) =>
  {
    socket.emit('LOGIN', obj); //отправка запроса и принятого функцией параметра
  };

  const onRegOpen = () => {
    setRegistration(true); //изменение состояния переменной registration
  }

  const onRegClose = () => {
    setRegistration(false); //изменение состояния переменной registration
  }

  const onRegistration = (obj) => {
    socket.emit('REG', obj); //отправка запроса и принятого функцией параметра
  }

  return (
    <div className="wrapper">
      {(!islogged && !registration) ?
        (<Login onLogin={onLogin} onRegOpen={onRegOpen}/>) 
        : (!islogged && registration) ? 
          (<Registration onRegClose={onRegClose} onRegistration={onRegistration}/>) 
        : (<Chat me={currentUser} />)}
    </div>
  );
}

export default App;
