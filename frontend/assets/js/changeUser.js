

function useRequest (method, url, upload = null, body = null) {
    return new Promise(((resolve, reject) => {
        const userToken = window.sessionStorage.getItem('Authorization')
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = function(event) {
            console.log(event.loaded + ' / ' + event.total);
        }
        xhr.open(method, url)
        xhr.responseType = 'json'
        if (method == 'GET'){
            xhr.setRequestHeader('Content-Type', 'application/json')
        }else if (method == 'PATCH'){
            xhr.setRequestHeader('Content-Type', 'application/json')
        }
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
function displayName(){
    useRequest('GET', 'http://127.0.0.1:8000/dj-rest-auth/user/').then(user => {
        const userInfo = document.getElementById('username')
        if (user.avatar) {
            userInfo.innerHTML = `<img class="avatar" src="${user.avatar}" alt="avatar"><p>${user.username}</p>`
        }else{
            userInfo.innerHTML = `<p>${user.username}</p>`
        }
        currentUsername = user.username
    })
}
const usernameButton = document.getElementById('send-username-button')
usernameButton.addEventListener('click', () => {
    let username = document.getElementById('username-input').value
    useRequest('PATCH', 'http://127.0.0.1:8000/chenge_user/', {username:username}).then(data => console.log(data)).catch(err => console.log(err))
})
document.forms.sendAvatar.onsubmit = () => {
    let input = document.getElementById('avatar');
    let file = input.files[0]
    if (file) {
        useRequest('PATCH', 'http://127.0.0.1:8000/chenge_user/', {avatar: file})
    }
}
let currentUsername = ''
displayName()