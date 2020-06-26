export function CustomDrugModel(customDrug)
{
    return {
        GenericNameFarsi : customDrug ? customDrug.GenericNameFarsi : '',
        GenericNameEnglish : customDrug ? customDrug.GenericNameEnglish : '',
        MartindelCategory : customDrug ? customDrug.MartindelCategory : '',
        MedicalCategory : customDrug ? customDrug.MedicalCategory : '',
        UseCases : customDrug ? customDrug.UseCases : '',
        Mechanism : customDrug ? customDrug.Mechanism : '',
        Pharmacokinetics : customDrug ? customDrug.Pharmacokinetics : '',
        ForbiddenUseCases : customDrug ? customDrug.ForbiddenUseCases : '',
        MedicalConflicts : customDrug ? customDrug.MedicalConflicts : '',
        Wranings : customDrug ? customDrug.Wranings : '',
        MedicalRecommendations : customDrug ? customDrug.MedicalRecommendations : '',
        SideEffects : customDrug ? customDrug.SideEffects : '',
        ImageFileName : customDrug ? customDrug.ImageFileName : '',
        GenericCode : customDrug ? customDrug.GenericCode : '',
        DrugCommercialInfos : customDrug ? customDrug.DrugCommercialInfos : null,
        DrugShapes : customDrug ? customDrug.DrugShapes : null,
    }
}