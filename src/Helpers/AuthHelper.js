export function IsLoggedIn() {
    let token = sessionStorage.getItem('token');
    return token != '' && token != null;
}

export function LogOff() {
    sessionStorage.setItem('token', '');
}

export function LoggedIn(token) {
    console.log('token from server: ', token);
    sessionStorage.setItem('token', token);
    let t = sessionStorage.getItem('token');
    console.log('token after save: ', t);
}
export function GetAuthToken()
{
    return sessionStorage.getItem('token');
}