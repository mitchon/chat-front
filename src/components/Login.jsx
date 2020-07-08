import React from 'react';

function Login({onLogin, onRegOpen}) {
  const [login, setLogin] = React.useState(''); //состояние поля ввода логина
  const [password, setPassword] = React.useState(''); //состояние поля ввода пароля
  
  const onEnter = () => {
    //если логин и пароль пустые
    if (!login || !password) {
      return alert('Неверные данные'); //функция возвращает вывод сообщения в браузер
    }
    //записываем в переменную текущие состояния
    const obj = {
      login,
      password,
    };
    //запрашиваем функцию onLogin из родительского компонента через параметры
    onLogin(obj);
  };

  //обработка нажатия кнопки, принимает как параметр информацию о случившемся событии
  const keyHandle = (event) => {
    //если код нажатой клавиши события соответствует коду клавиши Enter
    if (event.keyCode === 13) {
      onEnter(); //выполняем функцию onEnter
    }
  };

  return (
    <div className="join-block" onKeyDown={(e) => keyHandle(e)}>
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onEnter} className="btn btn-success">
        Log in
      </button>
      <span onClick={onRegOpen}>{"Register new account"}</span>
    </div>
    );
}

export default Login;