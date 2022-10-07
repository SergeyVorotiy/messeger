let userListStorage = []
let chatListStorage = []
let chatMessageListStorage = {}
let websocket;
function useRequest (method, url, body = null) {
    return new Promise(((resolve, reject) => {
        const userToken = window.sessionStorage.getItem('Authorization')
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.setRequestHeader('Authorization', userToken)
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }

        xhr.send(JSON.stringify(body))
    }))
}

function displayMessageList(chaID){
    let messageList = document.getElementById('message-block')
    // useRequest('GET', 'http://127.0.0.1:8000/chat_list/'+chaID+'/messages/').then(message_list => {
    //     let messageSTR = ''
    //     if (!userListStorage) {
    //         getUsers()
    //     }
    //     message_list.forEach(message => {
    //         let username = ''
    //         userListStorage.forEach(user => {
    //             if (user.id == message.author){
    //                 username = user.username
    //             }
    //         })
    //         if (username != '') {
    //             messageSTR += `
    //             <p>${username}: ${message.text}</p>
    //             `
    //         }else{
    //             messageSTR += `
    //             <p>Я: ${message.text}</p>
    //             `
    //         }
    //     })
    //     messageList.innerHTML = messageSTR
    //     chatMessageListStorage['chatID'] = message_list
    //     console
    //     let id = 'Chat_'+chaID
    //     let activeChat = document.getElementById(id)
    //     let sendingForm = document.getElementById('send-message-form')
    //     sendingForm.setAttribute('class', 'displayed')
    //     activeChat.setAttribute('class', 'chat-item active_chat')
    // })
    websocket = new WebSocket('ws://127.0.0.1:8000/ws/chat_list/13/')
    websocket.onopen = event => {
        console.log('event')
    }

    // websocket.onmessage = event => {
    //     messages.append(event.data)
    //     let newMessge = document.createElement('p')
    //     newMessge.innerHTML = `
    //                     ${currentUsername}: ${event.data}
    //                     `
    //     let messages = document.getElementById('message-block')
    //     messages.insertAdjacentElement(messages.childNodes[messages.childNodes.length -1].position, newMessge)
    // }
    websocket.onerror = err => {
        console.log(err)
    }

}
function sendMessage(chat_id, text){
    useRequest('POST', 'http://127.0.0.1:8000/chat_list/'+chat_id+'/messages/', {text:text}).then(() => displayMessageList(chat_id))
}
function display_chat_list(){
    let chatList = document.getElementById('chat-items')
    useRequest('GET', 'http://127.0.0.1:8000/chat_list/').then(chat_list => {
        getUsers()
        let chatString = ''
        chat_list.forEach(chat => {
            chatString += `
            <div id="Chat_${chat.id}" class="chat-item">
                <p>${chat.chat_name}</p>
            </div>
            `
        })
        chatList.innerHTML = chatString
        chatList.querySelectorAll('.chat-item').forEach(item => {
            const chat_id = +item.id.substr(item.id.indexOf('_') + 1)
            item.addEventListener('click', () => {
                let activeChat = chatList.querySelector('.active_chat')
                if (activeChat){
                    activeChat.setAttribute('class', 'chat-item')
                }

                window.sessionStorage.setItem('Active_chat', chat_id)
                displayMessageList(window.sessionStorage['Active_chat'])

            })
        })
        if (window.sessionStorage['Active_chat']) {
            displayMessageList(window.sessionStorage['Active_chat'])
        }
        sendButton = document.getElementById('send-message-button')
        sendButton.addEventListener('click', () => {
            let text = document.getElementById('text-message')
            websocket.send(text.value)
            sendMessage(window.sessionStorage.getItem('Active_chat'), text.value)
            text.value = ''
        })
        chatListStorage = chat_list
    })
}
function createChat() {
    const creation = document.getElementById('create_chat_form')
    let checkboxes = creation.querySelectorAll('.user_checkBox')
    let chatName = document.getElementById('set_chat_name').value
    let recipients = []
    checkboxes.forEach(checkbox => {
        if (checkbox.checked){
            let idSTR = checkbox.id.substr(checkbox.id.indexOf('_')+1)
            let userID = +idSTR.substr(idSTR.indexOf('_')+1)
            recipients.push(userID)
        }

    })
    const request = {
        chat_name:chatName,
        recipients:recipients
    }
    useRequest('POST', 'http://127.0.0.1:8000/chat_list/', request).then(data => {
        display_chat_list()
        sessionStorage.setItem('Active_chat', data.id)
    })
}
function getUsers(){
    useRequest('GET', 'http://127.0.0.1:8000/user_list/')
        .then(userListResponse => {
            userListStorage = userListResponse
            })
        .catch(err => console.log('Ошиька получения пользователей: '+err))
}
const newChatButton = document.getElementById('new-chat-button')
newChatButton.addEventListener('click', () => {
    console.log('new chat button clicked')
    let userListView = document.createElement('div')
    userListView.setAttribute('class', 'user-list-view')
    let userlist = []
    useRequest('GET', 'http://127.0.0.1:8000/user_list/')
        .then(userListResponse => {
            userlist = userListResponse
            let userViewStr = `<div id="create_chat_form"><input id="set_chat_name" type="text" value="New Chat">`
            userlist.forEach(user => {
                if (user.avatar){
                    userViewStr += `
                <div id="user_${user.id}" class="user_card">
                <label for="check_user_${user.id}"><input class="user_checkBox" id="check_user_${user.id}" type="checkbox">
                <img class="avatar" src="http://127.0.0.1:8000${user.avatar}" alt="avatar"><p>${user.username}</p></label>
                </div>
                `
                }else{
                    userViewStr += `
                <div id="user_${user.id}" class="user_card">
                <label for="check_user_${user.id}"><input class="user_checkBox" id="check_user_${user.id}" type="checkbox">
                <p>${user.username}</p></label>
                </div>
                `
                }
            })
            userViewStr += `<button id="Created_chat">Создать чат</button>
                            <button id="cancel_created_chat">Отменить</button></div>`

            userListView.innerHTML = userViewStr
            document.body.insertBefore(userListView, document.querySelector('.content'))
            // let checkboxes = userListView.querySelectorAll('.user_checkBox')
            const creationButton = document.getElementById('Created_chat')
            creationButton.addEventListener('click', () => {
                createChat()
                document.body.removeChild(userListView)

            })
            const cancelButton = document.getElementById('cancel_created_chat')
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(userListView)
            })
            userListStorage = userListResponse
        })
        .catch(err => console.log(err))
})

display_chat_list()

