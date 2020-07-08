import React from 'react';

function Edit({onEdit}) {  
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');

  const onEnter = () => {
    if (!login || !password || !oldPassword) {
      return alert('Неверные данные');
    }
    const obj = {
      login,
      password,
      oldPassword
    };
    onEdit(obj);
  };

  return (
    <div className="edit">
      Edit your account info
      <input type="text" placeholder="New Login" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <button className="btn btn-success" onClick={onEnter}>Edit</button>
    </div>
    );
}

export default Edit;