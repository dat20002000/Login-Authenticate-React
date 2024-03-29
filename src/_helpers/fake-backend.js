let users = JSON.parse(localStorage.getItem('users') || []);

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

                if (url.endsWith('/users') && opts.method === 'GET') {
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ok: true, text: () => JSON.stringify(user)});
                    } else {
                        rejects('Unauthorised');
                    }

                    return;
                }

                if (url.endsWith('/users/register') && opts.method === 'POST') {
                    let newUser = JSON.parse(opts.body);

                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        rejects('Username "' + newUser.username + '" is already taken!');
                        return;   
                    }

                    newUser.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    resolve( {ok: true, text: () => Promise.resolve() });

                    return;
                }

                if (url.match(/\/users\/\d+$/) && opts.method === 'DELETE') {
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        let urlParts = url.split('/');
                        let id = this.parseInt(urlParts[urlParts.length - 1]);

                        for (let i = 0; i < users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {
                                users.splice(i ,1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }                            
                        }

                        resolve( {ok: true, text: () => Promise.resolve()});
                    } else {
                        rejects('Unauthorised');
                    }

                    return;
                }

                realFetch(url, opts).then(response => resolve(response));
            }, 500);
        })
    }
}