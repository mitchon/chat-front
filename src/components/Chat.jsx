import React from 'react';
import socket from '../socket';
import Edit from './Edit';

function Chat ({me}) {
    const [messageValue, setMessageValue] = React.useState(''); //состояние поля ввода сообщения
    const [searchLogin, setSearch] = React.useState(''); //состояние поля ввода поиска пользователя
    const [users, setUsers] = React.useState([]); //состояние списка пользователей
    const [friends, setFriends] = React.useState([]); //состояние списка контактов
    const [messages, setMessages] = React.useState([]); //состояние списка сообщений
    const [show, setShow] = React.useState(false); //состояние, отвечающее за показ правой части интерфейса
    const [companion, setCompanion] = React.useState({}); //состояние текущего собеседника
    const [searching, setSearching] = React.useState(false); //состояние, отвечающее за текущий поиск
    const [editShow, setEditShow] = React.useState(false); //состояние, отвечающее за скрытие компонента Edit
    const [newMsgShow, setNewMsgShow] = React.useState(false); //состояние, отвечающее за показ уведомления
    const [newMsgSender, setNewMsgSender] = React.useState(); //состояние, отвечающее за отправителя пришедшего сообщения
    let tmpCnt = 0; //переменная для создания временного ключа компонентов jsx
    

    //функция отправки сообщения
    const onSendMessage = async () => {
        //если поле ввода не пустое
        if (messageValue) {
            //переменная-объект с данными о сообщении
            const obj = {
                value: messageValue,
                sender: me.user_id,
                receiver: companion.user_id,
            };
            await setMessages([...messages, obj]); //обновляем список сообщений
            setMessageValue('');//очисщаем поле ввода
            AutoScroll();//функция прокрутки страницы вниз
            socket.emit('MESSAGE:SEND', [obj.value, obj.sender, obj.receiver]); //посылаем запрос и массив с данными о сообщении

            let s = false;
            //проверка на то, был ли этот собеседник новым
            await friends.forEach(elem => companion.user_id === elem.user_id ? s = true : null);
            //если собеседник новый
            if(!s) {
                socket.emit('NEW:FRIEND', [me.user_id, companion.user_id]); //посылаем запрос о добавлении контакта
                setFriends([...friends, companion]); //обновление списка контактов
            }
        }
    };

    //функция автоматической прокрутки страницы вниз
    const AutoScroll = () => {
        const element = document.getElementById("messages"); //найти в dom-дереве элемент по id (div со списком сообщений)
        element.scrollTop = element.scrollHeight; //прокрутка элемента
    };

    //функция смены собеседника (принимает информацию о выбранном пользователе)
    const onDialogChange = async (companion) => {
        setCompanion(companion); //обновить состояние собеседника
        await setShow(true); //показать правую часть интерфейса (по умолчанию он скрыт)
        document.getElementById("header").innerHTML=companion.login; //установить в шапке имя собеседника
        AutoScroll(); //прокрутка
    };

    React.useEffect(() => {
        socket.emit('USER:FRIENDS', me.user_id);
        socket.emit('DIALOG:FIND', me.user_id);
        document.addEventListener("keydown", EscHandle);
        return (() => document.removeEventListener("keydown", EscHandle));

    }, []);

    React.useEffect(() => {
        socket.on('USER:FOUNDFRIENDS', (data) => {
            setUsers(data);
            setFriends(data);
        });

        socket.on('USER:FOUND', (data) => {
            setUsers(data);
        });

        socket.on('DIALOG:FOUND', (data) => {
            setMessages(data);
        });

    }, []);

    React.useEffect(() => {
        socket.on('NEW:MESSAGE', (data) => {
            data.receiver = me.user_id;
            setMessages([...messages, data]);
            setNewMsgShow(true);
            setNewMsgSender(data.sender);
        });
    }, [messages]);

    React.useEffect(() => {
        socket.on('EDIT:NO', () => {
            alert('Incorrect password');
        });
        
        socket.on('EDIT:YES', (data) => {
            setEditShow(false);
            me.login = data;
        });
    }, [me]);

    React.useEffect(() => {
        socket.on('USER:FOUNDNEWFRIEND', (data) => {
            setFriends([...friends, data]);
        });
    }, [friends]);

    //функция поиска
    const Search = () => {
        //если значение в строке поиска не совпадает с логином пользователя
        if (me.login !== searchLogin)
        {
            //если значение пустое
            if (!searchLogin) {
                alert('Пустой поисковый запрос!'); //уведомление в браузере
            }
            //иначе
            else {
                socket.emit('USER:FIND', searchLogin); //запрос поиска по логину, передаём логин
                setUsers([]); //сотрем список выведенных пользователей
                setSearching(true); //установим состояние поиска true
            }
        }
    };

    //отмена поиска
    const CloseSearch = () => { 
        setSearch(''); //очистка поля ввода
        setUsers(friends); //обновление списка выведенных пользователей (контакты)
        setSearching(false); //установим состояние поиска flase
    };

    //функция подсчёта временных ключей JSX-элементов
    function tempCounter() {
        tmpCnt = tmpCnt + 1;
        return tmpCnt;
    };
    
    //обработчик нажатия Enter
    const EnterHandle = (event) => {
        //если нажатая клавиша Enter
        if (event.keyCode === 13) {
            onSendMessage(); //функция отправки сообщения
            setMessageValue(''); //очистка поля ввода
        }
    };

    //обработчик нажатия Esc
    const EscHandle = (event) => {
        //если нажатая клавиша Esc
        if (event.keyCode === 27) {
            setShow(false); //скрыть правую часть интерфейса
            setCompanion(''); //стереть значение собеседника
        }
    };

    //функция инвертирования значерния editShow
    const Revolve = () => {
        setEditShow(!editShow); //новое значение = инверсия старого
    };

    //функция, вызываемая компонентом Edit
    const onEdit = (data) => {
        socket.emit('EDIT', data); // отправка запроса на редактирование и данные
    }

    //обработчик нажатия на уведомление (принимает логин отправителя)
    const notifierClick = (sender) => {
        setNewMsgShow(false); //скрытие уведомления
        onDialogChange(sender); //смена собеседника
    }

    return (
        <div className="chat">
            <div className="chat-users">
                <div className="kar">
                    <img src={me.image} />
                    {me.login}
                    <button className="btn btn-success" onClick={Revolve}>{ editShow ? '^' : 'V' }</button>
                </div>
                { editShow ? <Edit onEdit={onEdit} /> : null }
                <div className="search">
                    <input type="text" placeholder="Find new dialog" value={searchLogin} onChange={(e) => setSearch(e.target.value)} />
                    <button className="btn btn-success" onClick={Search}>Search!</button>
                    <button className="btn btn-danger" onClick={CloseSearch}>X</button>
                </div>
                <ul>
                    {users.map((user) => (
                        <div key={user.user_id} onClick={(e) => onDialogChange(user)}>
                            <li>
                                <img src={user.image} />
                                <div>{user.login}</div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
            {show ? <div className="chat-messages">
                <div className="msg-header" id="header"></div>
                <div className="messages" id="messages">
                            
                    {messages.map((message) => (
                        (message.sender === companion.user_id) ?
                            <div className="message" key={(!message.msg_id) ? "tmp" + tempCounter() : message.msg_id}>
                                <p className={(message.value.length > 30) ? "gomez" : null}>{message.value}</p>
                                <div>
                                    <span>{companion.login}</span>
                                </div>
                            </div> : 
                        (message.receiver === companion.user_id) ?
                            <div className="message" key={(!message.msg_id) ? "tmp" + tempCounter() : message.msg_id}>
                                <p>{message.value}</p>
                                <div>
                                    <span>{me.login}</span>
                                </div>
                            </div> : null
                    ))}
                </div>
                <form onKeyDown={(e) => EnterHandle(e)}>
                    <textarea
                    id="textarea"
                        value={messageValue}
                        onChange={(e) => setMessageValue(e.target.value)}
                        className="form-control"
                        rows="1"></textarea>
                    <button onClick={onSendMessage} type="button" className="btn btn-primary">
                        Send
                    </button>
                </form>
            </div> : null}
            {(newMsgShow && companion.user_id !== newMsgSender) ? 
                friends.map((friend) => (
                (friend.user_id === newMsgSender) ? <div className="notifier" onClick={(e) => notifierClick(friend)}>New message from: {friend.login}</div> : null)) 
                : null}
        </div>
    );
}

export default Chat;