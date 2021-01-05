import * as ConstantValues from '../Helpers/ConstantValues';
import { responseHandler } from '../Helpers/ResponseHandler';
import { authHeader } from '../Helpers/AuthHeader';
import { roles } from '../Helpers/Role';
import { authenticationService } from '../Services/AuthenticationService';
export const drugService = {
    newCustomDrug,
    getCustomDrugs,
    getCustomDrugById,
    confirmCustomDrug,
    toggleHideDrug: toggleHideDrug,
    getDrugs
}
function getDrugs(page, rowsInPage, query, drugStoreId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/getpaged?query=${query}&pagenumber=${page}&rowsinpage=${rowsInPage}&drugstoreid=${drugStoreId}`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drugs => { return drugs });
}

function toggleHideDrug(drugId, drugStoreId){
    let headers = authHeader();
    const requestOptions = {
        method: 'POST',
        headers: headers
    };
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/togglehide?id=${drugId}&drugStoreId=${drugStoreId}`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drug => { return drug; });
}

function newCustomDrug(drug) {
    let headers = authHeader();
    headers['Content-Type'] = 'application/json';
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(drug),
    };
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/createnew`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drug => { return drug; });
}

function getCustomDrugById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/${id}`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drug => { return drug });
}

function getCustomDrugs(page, rowsInPage, query, drugStoreId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/custom/getpaged?query=${query}&pagenumber=${page}&rowsinpage=${rowsInPage}&drugstoreid=${drugStoreId}`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drugs => { return drugs });
}
function confirmCustomDrug(id) {
    if (authenticationService.currentUserValue.roles.indexOf(roles.admin) < 0)
        return Promise.reject({ status: '401' });
    const requestOptions = {
        method: 'POST',
        headers: authHeader()
    }
    return fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/${id}/confirm`, requestOptions)
        .then(responseHandler.handleResponse)
        .then(drugs => { return drugs });
}