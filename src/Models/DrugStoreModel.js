export function DrugStoreModel(drugStore)
{
    return {
        Name : drugStore ? drugStore.Name : '',
        Address : drugStore ? drugStore.Address : '',
        ApplicationUserId : drugStore ? drugStore.ApplicationUserId : '',
        Email : drugStore ? drugStore.Email : '',
        IsActive : drugStore ? drugStore.IsActive : '',
        PhoneNumber : drugStore ? drugStore.PhoneNumber : '',
        Lat : drugStore ? drugStore.Lat : '',
        Lon : drugStore ? drugStore.Lon : '',
        Description : drugStore ? drugStore.Description : '',
        OwnerFullName : drugStore ? drugStore.OwnerFullName : ''
    }
}