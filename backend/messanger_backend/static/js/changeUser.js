let selfUserName;

function useRequest (method, url, body = null) {
    return new Promise(((resolve, reject) => {
        const userToken = window.sessionStorage.getItem('Authorization')
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = function(event) {
            console.log(event.loaded + ' / ' + event.total);
        }
        xhr.open(method, url)
        xhr.responseType = 'json'
        if (method == 'GET' || method == 'PUT'){
            xhr.setRequestHeader('Content-Type', 'application/json')
        }
        // else if (method == 'PATCH'){
        //     xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=something')
        // }
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

        xhr.send(body)
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
    let userName = document.getElementById('username-input').value
    let usernameData = {
        username: userName,
    }
    useRequest('PUT', 'http://127.0.0.1:8000/chenge_user/', JSON.stringify({username: userName}))
        .then(data => {
            console.log(data)
            window.location.reload()
    })
        .catch(err => console.log(err))
})
document.forms.sendAvatar.onsubmit = () => {
    let input = document.getElementById('avatar');
    let file = input.files[0]
    console.log(currentUsername)
    let formData = new FormData()
    formData.append('username', currentUsername)
    formData.append('avatar', file)
    if (file) {
        useRequest('PATCH', 'http://127.0.0.1:8000/chenge_user/', formData).then(data => console.log(data)).catch(err => console.log(err))
    }
}
let currentUsername = ''
displayName()
