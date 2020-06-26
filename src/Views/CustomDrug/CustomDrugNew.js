import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Tooltip, IconButton, FormControl, TextField, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import * as drugStoreHelper from '../../Helpers/DrugStoreHelper';
import useNetDrugStyles from '../../Components/Styles';
import noImage from '../../Assets/Images/no-image.jpg';
import {drugService} from '../../Services/DrugServices';
import ImageUploader from 'react-images-upload';
import { getBase64 } from '../../Helpers/FileHelper';
import Grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        fontFamily: 'IranSans'
    },
    grid: {
        padding: theme.spacing(2)
    }
}));
const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function CustomDrugNew() {
    const netDrugStyles = useNetDrugStyles();
    const [customDrug, setCustomDrug] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccessfuly, setSavedSuccessfuly] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
   
    const newCustomDrug = async function () {
        try {
            setIsSaving(true);
            customDrug.DrugStoreId = drugStoreHelper.getDrugStoreId();
            const response = await drugService.newCustomDrug(customDrug);
            if (!response) {
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    if (response.Data && response.Code === '0') {
                        setSavedSuccessfuly(true);
                        enqueueSnackbar('داروی جدید با موفقیت ثبت شد', { variant: 'success' });
                    }
                    else {
                        enqueueSnackbar('خطا در اعمال تغییرات، لطفا مجددا تلاش کنید', { variant: 'warning' });
                    }

                } catch (error) {
                    enqueueSnackbar("خطا در دریافت اطلاعات از سرور", { variant: 'error' });
                }
            }

        } catch (error) {
            console.log(error);
            if (error == 'TypeError: Failed to fetch') {
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
        }
        finally {
            setIsSaving(false);
        }
    }
    

  
   
    if(savedSuccessfuly)
    {
        return (<Redirect to='/customdrug/all'/>)
    }
    return (
        <Grid container>
            <Grid container item direction='column' style={{ margin: '50px' }}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="genericNameEnglish"
                            type='text'
                            label="نام جنریک انگلیسی"
                            value={customDrug.GenericNameEnglish || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, GenericNameEnglish: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="genericNameFarsi"
                            type='text'
                            label="نام جنریک فارسی"
                            value={customDrug.GenericNameFarsi || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, GenericNameFarsi: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="genericCode"
                            type='text'
                            label="کد جنریک"
                            value={customDrug.GenericCode || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, GenericCode: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="martindelCat"
                            type='text'
                            label="دسته بندی مارتیندل"
                            value={customDrug.MartindelCategory || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, MartindelCategory: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="medicalCat"
                            type='text'
                            label="دسته بندی دارویی"
                            value={customDrug.MedicalCategory || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, MedicalCategory: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="mechanism"
                            type='text'
                            label="مکانیزم اثر"
                            value={customDrug.Mechanism || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, Mechanism: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="pharmakokinectics"
                            type='text'
                            label="فارماکو کینتیک"
                            value={customDrug.Pharmacokinetics || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, Pharmacokinetics: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="conflicts"
                            type='text'
                            label="تداخل دارویی"
                            value={customDrug.MedicalConflicts || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, MedicalConflicts: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="warnings"
                            type='text'
                            label="هشدار های مصرف"
                            value={customDrug.Wranings || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, Warnings: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="usecases"
                            type='text'
                            label="موارد استفاده"
                            value={customDrug.UseCases || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, UseCases: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="medicalRecommendations"
                            type='text'
                            label="توصیه های پزشکی"
                            value={customDrug.MedicalRecommendations || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, MedicalRecommendations: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="sideEffects"
                            type='text'
                            label="اثرات جانبی"
                            value={customDrug.SideEffects || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                setCustomDrug(newCustomDrug => ({ ...newCustomDrug, SideEffects: eventTarget.value }))
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="commercialInfo"
                            type='text'
                            label='نام تجاری'
                            value={(customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] && customDrug.DrugCommercialInfos[0].CommercialName) || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                let commercialInfo = customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] ? customDrug.DrugCommercialInfos : [{}];
                                commercialInfo[0].CommercialName = eventTarget.value;
                                setCustomDrug(newCustomDrug =>
                                     ({ ...newCustomDrug, DrugCommercialInfos: commercialInfo}));
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="producer"
                            type='text'
                            label='تولید کننده'
                            value={(customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] && customDrug.DrugCommercialInfos[0].Producer) || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                let commercialInfo = customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] ? customDrug.DrugCommercialInfos : [{}];
                                commercialInfo[0].Producer = eventTarget.value;
                                setCustomDrug(newCustomDrug =>
                                     ({ ...newCustomDrug, DrugCommercialInfos: commercialInfo}));
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="importer"
                            type='text'
                            label='شرکت وارد کننده'
                            value={(customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] && customDrug.DrugCommercialInfos[0].ImporterCompany) || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                let commercialInfo = customDrug.DrugCommercialInfos && customDrug.DrugCommercialInfos[0] ? customDrug.DrugCommercialInfos : [{}];
                                commercialInfo[0].ImporterCompany = eventTarget.value;
                                setCustomDrug(newCustomDrug =>
                                     ({ ...newCustomDrug, DrugCommercialInfos: commercialInfo}));
                            }} />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            style={{ margin: '20px' }}
                            dir="rtl"
                            id="drugShapes"
                            type='text'
                            label='شکل دارویی'
                            value={(customDrug.DrugShapes && customDrug.DrugShapes[0] && customDrug.DrugShapes[0].Name) || ''}
                            onChange={(event) => {
                                let eventTarget = event.currentTarget;
                                let drugShape = customDrug.DrugShapes && customDrug.DrugShapes[0] ? customDrug.DrugShapes : [{}];
                                drugShape[0].Name = eventTarget.value;
                                setCustomDrug(newCustomDrug =>
                                     ({ ...newCustomDrug, DrugShapes: drugShape}));
                            }} />
                    </FormControl>
                    <Grid item container direction='row'>
                        <Grid xs={12} md={3} item alignContent='center' alignItems='center'>
                            <img src={customDrug.ImageData ? customDrug.ImageData : noImage}
                                alt='تصویر دارو'
                                style={{ height: 187 }} />
                        </Grid>
                        <Grid xs={12} md={9} item id='imageGrid'>
                            <ImageUploader
                                withIcon={true}
                                buttonText='انتخاب عکس'
                                onChange={(image) => {
                                    getBase64(image[0]).then(result => {
                                        setCustomDrug({ ...customDrug, ImageData: result });
                                    }).catch(() => {
                                        setCustomDrug({ ...customDrug, ImageData: noImage });
                                    });
                                }}
                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                maxFileSize={5242880}
                                buttonStyles={{
                                    background: 'linear-gradient(to right, #42a5f5bb, #42a5f588)',
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #42a5f5aa, #42a5f577)'
                                    },
                                    border: '1px solid #42a5f522',
                                    boxShadow: '0px 4px 32px #42a5f555',
                                    borderRadius: '100',

                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    fontFamily: 'IranSans',
                                    color: '#ffffff'
                                }}
                                label='جهت تغییر تصویر، دکمه انتخاب عکس را کلیک کنید (بیشترین حجم فایل تصویر مجاز: 5 مگابایت)'
                                singleImage={true}
                                fileSizeError='حجم فایل تصویر انتخاب شده بیشتر از 5 مگابایت است '
                                withPreview={true}

                            />
                        </Grid>
                    </Grid>


                    <Grid direction='row' item container >
                        <Grid item style={{ margin: '10px' }} alignContent='flex-end' >
                            <Button style={{ marginLeft: '5px', minHeight: '24px', minWidth: '85px' }}
                                onClick={newCustomDrug}
                                disabled={isSaving}
                                className={netDrugStyles.gradientButtonPrimary}>
                                    { isSaving ? <CircularProgress size={24}/> : 'اعمال تغییرات'}
                            </Button>
                            <Button style={{ marginRight: '5px' }} 
                            disabled={isSaving}
                            component={Link}
                            to={`/customdrug/${customDrug.Id}/details`}
                            className={netDrugStyles.gradientButtonPrimaryFlat}>
                                    انصراف
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Grid >
    );
}