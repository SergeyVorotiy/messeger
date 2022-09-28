
function useRequest (method, url, body = null) {
    return new Promise(((resolve, reject) => {
        const userToken = window.sessionStorage.getItem('Authorization')
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json', 'Access-Control-Allow-Origin', '*')
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
    useRequest('GET', 'http://127.0.0.1:8000/chat_list/'+chaID+'/messages/').then(message_list => {
        let messageSTR = ''
        message_list.forEach(message => {
            messageSTR += `
            <p>${message.author}: ${message.text}</p>
            `
        })
        messageList.innerHTML = messageSTR

    })
}
function sendMessage(chat_id, text){
    useRequest('POST', 'http://127.0.0.1:8000/chat_list/'+chat_id+'/messages/', {text:text}).then(data => displayMessageList(chat_id))

}
function display_chat_list(){
    let chatList = document.getElementById('chat-items')
    useRequest('GET', 'http://127.0.0.1:8000/chat_list/').then(chat_list => {
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
                displayMessageList(chat_id)
                let sendingForm = document.getElementById('send-message-form')
                sendingForm.setAttribute('class', 'displayed')
                window.sessionStorage.setItem('Active_chat', chat_id)
            })
        })
        sendButton = document.getElementById('send-message-button')
        sendButton.addEventListener('click', () => {
            let text = document.getElementById('text-message')
            sendMessage(window.sessionStorage.getItem('Active_chat'), text.value)
            text.value = ''
        })
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
    useRequest('POST', 'http://127.0.0.1:8000/chat_list/', request).then(data => display_chat_list())
}
const newChatButton = document.getElementById('new-chat-button')
newChatButton.addEventListener('click', () => {
    console.log('new chat button clicked')
    let userListView = document.createElement('div')
    userListView.setAttribute('class', 'user-list-view')
    let userlist = []
    useRequest('GET', 'http://127.0.0.1:8000/user_list/')
        .then(userlistResponse => {
            userlist = userlistResponse
            let userViewStr = `<div id="create_chat_form"><input id="set_chat_name" type="text" value="New Chat">`
            userlist.forEach(user => {
                if (user.avatar){
                    userViewStr += `
                <div id="user_${user.id}" class="user_card">
                <label for="check_user_${user.id}"><input class="user_checkBox" id="check_user_${user.id}" type="checkbox">
                <img src="http://127.0.0.1:8000${user.avatar}"><p>${user.username}</p></label>
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
            document.body.insertBefore(userListView, document.querySelector('content'))
            let checkboxes = userListView.querySelectorAll('.user_checkBox')
            const creationButton = document.getElementById('Created_chat')
            creationButton.addEventListener('click', () => {
                createChat()
                document.body.removeChild(userListView)

            })
            const cancelButton = document.getElementById('cancel_created_chat')
            cancelButton.addEventListener('click', () => {
                document.body.removeChild(userListView)
            })

})
        .catch(err => console.log(err))
})



display_chat_list()