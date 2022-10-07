function useRequest (method, url, body = null) {
    return new Promise(((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-Type', 'application/json', 'Access-Control-Allow-Origin', '*')
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
window.sessionStorage.clear()
button = document.getElementById('login-button')

button.addEventListener('click', () => {
    const requestBody = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    useRequest('POST', 'http://127.0.0.1:8000/dj-rest-auth/login/', requestBody)
        .then(data => {
            console.log(data)
            window.sessionStorage.setItem('Authorization', 'Token '+data.key)
            window.location.replace('http://127.0.0.1:8000/messanger/')
        })
        .catch(err => console.log(err))
});
