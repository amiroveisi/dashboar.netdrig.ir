import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography, Tooltip, IconButton } from '@material-ui/core';
import DrugStoreList from '../../Components/DrugStoreList';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import PagedTable from '../../Components/PagedTable';
import * as drugStoreHelper from '../../Helpers/DrugStoreHelper';
import DetailsRoundedIcon from '@material-ui/icons/DetailsRounded';
import useNetDrugStyles from '../../Components/Styles';
import TextDetail from '../../Components/TextDetail';
import noImage from '../../Assets/Images/no-image.jpg';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';

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

export default function CustomDrugDetails(props) {
    const netDrugStyles = useNetDrugStyles();
    const [customDrug, setCustomDrug] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [imageHeight, setImageHeight] = useState(0);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        const customDrugId = props.match.params.customDrugId;
        if (!customDrug)
            loadCustomDrug(customDrugId, abortSignal);
        //useEffect cleanup
        return () => { abortController.abort() };
    }, []);

    const loadCustomDrug = async function (customDrugId, cancellationToken) {
        try {

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/crawler/drug/get/${customDrugId}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    }
                }, { signal: cancellationToken });
            if (!response) {
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else if (response.status === 401) {
                setUnauthorized(true);
                enqueueSnackbar("شما وارد حساب کاربری خود نشده اید یا دسترسی به این بخش ندارید", { variant: 'error' });

            }
            else {
                try {
                    const serverData = await response.json();
                    if (serverData && serverData.Data && serverData.Code === '0') {
                        setCustomDrug(serverData.Data);
                        setImageHeight(document.getElementById('imageGrid').clientHeight);
                    }
                    else if (response.status === 401) {
                        setUnauthorized(true);
                        enqueueSnackbar("شما وارد حساب کاربری خود نشده اید یا دسترسی به این بخش ندارید", { variant: 'error' });
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات داروخانه. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
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
    }

 
    if (!customDrug) {
        return (<p>در حال بارگذاری...</p>);
    }
    return (
        <Grid container>
            <Grid container item direction='column'>
                <Grid container item alignItems='flex-start' direction='row' spacing={1} style={{marginTop:'10px'}}>
                    <Grid item id='imageGrid' style={{ height: '260px' }}>
                        <Tooltip title='جهت نمایش تصویر بزرگتر کلیک کنید'>
                            <img src={customDrug.ImageData ? customDrug.ImageData : noImage}
                                onClick={() => setImageDialogOpen(true)}
                                alt='تصویر دارو'
                                style={{ cursor: 'zoom-in', height: imageHeight - 32 }} />
                        </Tooltip>
                    </Grid>
                    <Grid item >
                        <TextDetail text={customDrug.GenericNameEnglish} caption='نام انگلیسی' />
                        <TextDetail text={customDrug.GenericNameFarsi} caption='نام فارسی' />
                        <TextDetail text={customDrug.GenericCode} caption='کد جنریک' />
                    </Grid>
                    <Grid item>
                       
                            <Button
                            className={netDrugStyles.gradientButtonPrimary2}
                            component={Link} to={`/customdrug/${customDrug.Id}/edit`}>
                               ویرایش
                            </Button>
                       
                    </Grid>
                    <Grid item>
                            <Button 
                            className={netDrugStyles.gradientButtonPrimaryOutlined}
                            component={Link} to={`/customdrug/all`}>
                               بازگشت به لیست داروها
                            </Button>
                    </Grid>
                </Grid>
                <Grid container item direction='row'>
                    <Grid item sm={12} md={6} lg={4}>
                        <TextDetail text={customDrug.GenericNameEnglish} caption='نام انگلیسی' />
                        <TextDetail text={customDrug.GenericNameFarsi} caption='نام فارسی' />
                        <TextDetail text={customDrug.GenericCode} caption='کد جنریک' />
                        <TextDetail text={customDrug.MartindelCategory} caption='دسته بندی مارتیندل' />
                        <TextDetail text={customDrug.MedicalCategory} caption='دسته بندی دارویی' />

                    </Grid>
                    <Grid item sm={12} md={6} lg={4}>
                        <TextDetail text={customDrug.Mechanism} caption='مکانیزم اثر' />
                        <TextDetail text={customDrug.Pharmacokinetics} caption='فارماکو کینتیک' />
                        <TextDetail text={customDrug.ForbiddenUseCases} caption='موارد منع مصرف' />
                        <TextDetail text={customDrug.MedicalConflicts} caption='تداخل دارویی' />
                        <TextDetail text={customDrug.Wranings} caption='هشدار ها' />
                    </Grid>
                    <Grid item sm={12} md={6} lg={4}>
                        <TextDetail text={customDrug.UseCases} caption='موارد استفاده' />
                        <TextDetail text={customDrug.MedicalRecommendations} caption='توصیه های پزشکی' />
                        <TextDetail text={customDrug.SideEffects} caption='اثرات جانبی' />
                        <TextDetail text={customDrug.DrugCommercialInfos  && customDrug.DrugCommercialInfos[0] ? customDrug.DrugCommercialInfos[0].CommercialName : 'نامشخص'} caption='نام تجاری' />
                        <TextDetail text={customDrug.DrugShapes && customDrug.DrugShapes[0] ? customDrug.DrugShapes[0].Name : 'نامشخص'} caption='شکل دارویی' />

                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={imageDialogOpen} aria-labelledby="تصویر دارو" fullWidth maxWidth="lg">
                <DialogTitle id="form-dialog-title">
                    <Grid container justify='space-between'>
                        <Grid item style={{ textAlign: 'right' }}>
                            تصویر دارو
                </Grid>
                        <Grid item style={{ textAlign: 'left' }}>
                            <IconButton>
                                <ClearRoundedIcon onClick={() => setImageDialogOpen(false)}></ClearRoundedIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid container alignItems='center' justify='center' direction='column' spacing={2}>
                        <Grid item>
                            <img src={customDrug.ImageFileName ? customDrug.ImageFileName : noImage}
                                onClick={() => setImageDialogOpen(false)}
                                alt='تصویر دارو' height='480px'
                                style={{ cursor: 'zoom-out' }} />
                        </Grid>
                    </Grid>


                </DialogContent>

            </Dialog>
        </Grid >
    );
}