import { resolve } from "dns";
import { rejects } from "assert";

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
                        let user   
                    }
                }
            })
        })
    }
}