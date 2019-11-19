let user = JSON.parse(localStorage.getItem('users') || []);

export function configureFakeBackEnd() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, rejects) => {
            setTimeout(() => {
                if(url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    let params = JSON.parse(opts.body);

                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if(filteredUsers.length){
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-jwt-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson))});   
                    } else {
                        rejects('Username or Password is incorrect! Please try again');
                    }

                    return;
                }
            })
        })
    }
}