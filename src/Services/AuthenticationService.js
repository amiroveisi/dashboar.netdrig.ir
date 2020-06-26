import { BehaviorSubject } from 'rxjs';

import * as ConstantValues from '../Helpers/ConstantValues';
import { responseHandler } from '../Helpers/ResponseHandler';
import jwtDecode from 'jwt-decode';
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    isInRole
};

function isInRole(role)
{
    return currentUserSubject.value && currentUserSubject.value.roles && currentUserSubject.value.roles.indexOf(role) > -1;
}

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `Username=${username}&Password=${password}&grant_type=password`
    };

    return fetch(`${ConstantValues.WebApiBaseUrl}/oauth2/token`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify({
                token: user.access_token,
                roles: jwtDecode(user.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            }));
            currentUserSubject.next({
                token: user.access_token,
                roles: jwtDecode(user.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            });

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}