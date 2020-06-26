import { BehaviorSubject } from 'rxjs';

const userNotAuthorizedSubject = new BehaviorSubject(false);

export const responseHandler = {
    handleResponse,
    userNotAuthorized : userNotAuthorizedSubject.asObservable()
};
function handleResponse(response, unauthorizedCallback) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
               unauthorizedCallback && unauthorizedCallback();
               userNotAuthorizedSubject.next(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}