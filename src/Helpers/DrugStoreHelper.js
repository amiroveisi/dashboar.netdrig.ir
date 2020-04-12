import * as constantValues from './ConstantValues';
export function setDrugStoreId(drugStoreId) {
    sessionStorage.setItem('drugStoreId', drugStoreId);
}
export function getDrugStoreId() {
    let id = sessionStorage.getItem('drugStoreId');
    if (!id)
        id = constantValues.EmptyGUID;
    return id;
}