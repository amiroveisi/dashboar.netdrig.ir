import * as ConstantValues from './ConstantValues';


export function IsLoggedIn() {
    let token = sessionStorage.getItem('token');
    return token != '' && token != null;
}

export function LogOff() {
    sessionStorage.setItem('token', '');
    sessionStorage.removeItem('currentUserInfo');
}

export function LoggedIn(token) {
    sessionStorage.setItem('token', token);
}
export function GetAuthToken() {
    return sessionStorage.getItem('token');
}
export async function GetUserInfo(cancellationToken) {
    const currentUserInfo = sessionStorage.getItem('currentUserInfo');
    if (currentUserInfo && currentUserInfo.UserName)
        return Promise.resolve(sessionStorage.getItem('currentUserInfo'));
    let result = null;
    try {
        const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/account/userinfo`,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${GetAuthToken()}`
                },

            }, { signal: cancellationToken });
        try {
            const serverData = await response.json();
            if (serverData && serverData.Data && serverData.Code === '0') {
                result = serverData.Data;
            }
        } catch (error) {
        }

    } catch (error) {
        console.log(error);
    }
    sessionStorage.setItem('currentUserInfo', result);
    return Promise.resolve(result ? result : 'error');

}