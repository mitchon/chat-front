import React from 'react';

function Registration({onRegClose, onRegistration}) {
  const [login, setLogin] = React.useState(''); //состояние поля ввода логина
  const [password, setPassword] = React.useState(''); //поля ввода пароля
  
  const keyHandle = (event) => {
    if (event.keyCode === 13) {
      onEnter();
    }
  }

  const onEnter = () => {
    if (!login || !password) {
      return alert('Неверные данные');
    }
    const obj = {
      login,
      password
    };
    onRegistration(obj);
  };

  return (
    <div className="join-block" onKeyDown={(e) => keyHandle(e)}>
      <input
        type="text"
        placeholder="Login (up to 15 chars)"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (up to 15 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onEnter} className="btn btn-success">
        Register
      </button>
      <button onClick={onRegClose} className="btn btn-danger">
        Cancel
      </button>
    </div>
  );
}

export default Registration;