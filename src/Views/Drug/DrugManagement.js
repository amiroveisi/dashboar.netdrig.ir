import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography, Tooltip, FormControl, TextField, CircularProgress } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';
import PagedTable from '../../Components/PagedTable';
import * as drugStoreHelper from '../../Helpers/DrugStoreHelper';
import DetailsRoundedIcon from '@material-ui/icons/DetailsRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import useNetDrugStyles from '../../Components/Styles';
import { drugService } from '../../Services/DrugServices';
import { authenticationService } from '../../Services/AuthenticationService';
import { roles } from '../../Helpers/Role';
import { icons } from '../../Helpers/Icons';
import * as ConstantValues from '../../Helpers/ConstantValues';

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
export default function DrugManagement() {
    const netDrugStyles = useNetDrugStyles();
    const [dataIsEmpty, setDataIsEmpty] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [canClearSearch, setCanclearSearch] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentDrug, setCurrentDrug] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const noDataView = (<h6>اطلاعاتی برای نمایش وجود ندارد</h6>);

    const loadDrugs = async function (page, rowsInPage) {
        try {
            let normalizedQuery = searchQuery ? searchQuery.trim() : '';
            const response = await drugService.getDrugs(page, rowsInPage, normalizedQuery, drugStoreHelper.getDrugStoreId());
            if (!response) {
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    return { data: response.Data.CurrentPageData, totalCount: response.Data.TotalRows }
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
            setSearchClicked(false);
        }

    }
    const toggleHideDrug = async function (drugId) {
        try {
            setIsSaving(true);
            const response = await drugService.toggleHideDrug(drugId, drugStoreHelper.getDrugStoreId());
            if (!response) {

                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    enqueueSnackbar('عملیات با موفقیت انجام شد', { variant: 'succcess' });
                    return response.Data;
                } catch (error) {
                    enqueueSnackbar("خطا در دریافت اطلاعات از سرور", { variant: 'error' });
                }
            }

        } catch (error) {
            setSearchClicked(false);
            console.log(error);
            if (error == 'TypeError: Failed to fetch') {
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
        }
        finally {
            setSearchClicked(false);
            setIsSaving(false);
            setCurrentDrug(null);
        }
    }
    const search = () => {
        setSearchClicked(true);
        if (canClearSearch) {
            setSearchQuery(null);
        }
        setCanclearSearch(!canClearSearch);
    }
    const classes = useStyles();

    if (dataIsEmpty) {
        return (<div className={classes.root}>{noDataView}</div>);
    }
    // if(isSaving)
    // {
    //     return (<p>در حال انجام عملیات...</p>)
    // }
    // if(currentDrug)
    // {
    //     toggleHideDrug(currentDrug.Id);
    // }
    return (
        <div className={classes.root}>
            <Container className="h-100" >
                <Grid container className={classes.grid}
                    style={{ marginTop: '30px' }}
                    direction="column" xs={12}
                    justify="center"
                    spacing={2}
                    alignItems="stretch" >
                    <Grid item xs={12}>
                        <Typography component="h3">
                            لیست داروها
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <TextField
                                dir="rtl"
                                id="search"
                                type='text'
                                label="جستجوی دارو"
                                value={searchQuery || ''}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value)
                                }}
                                onKeyPress={(event) => {
                                    if (event.charCode === ConstantValues.EnterKey) {
                                        search();
                                    }
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid container justify="flex-end">
                        {authenticationService.isInRole(roles.admin)
                            && <Grid item>
                                <Button className={netDrugStyles.gradientButtonPrimaryOutlined} startIcon={<Add />} component={Link} to="/customdrug/new">داروی جدید</Button>
                            </Grid>}
                    </Grid>
                    <Grid item style={{ marginTop: '10px' }}>
                        <PagedTable
                            dataId={(drug) =>
                                `${drug.Id}`}
                            selectable={false}
                            rowsPerPageOptions={[25, 50, 100, 200]}
                            headers={[
                                {
                                    title: 'وضعیت نمایش',
                                    value: (row) =>
                                        (row.PriceSettings &&
                                            row.PriceSettings.IsHidden) ? icons.visibilityOffIcon('grey') : icons.visibilityRoundedIcon('grey'),
                                    style: {
                                        'background': '#A1DFFB88'
                                    },
                                    isAction: true
                                },
                                {
                                    title: 'نام فارسی',
                                    value: (drug) => drug.Drug.GenericNameFarsi,
                                    style: {
                                        'background': '#A1DFFB88'
                                    }
                                },
                                {
                                    title: 'نام لاتین',
                                    value: (drug) => drug.Drug.GenericNameEnglish,
                                    style: {
                                        'background': '#A1DFFB88'
                                    }
                                },
                                {
                                    title: 'تولید کننده',
                                    value: (drug) => drug.Drug.DrugCommercialInfos ? drug.Drug.DrugCommercialInfos[0].CommercialName : '',
                                    style: {
                                        'background': '#A1DFFB88'
                                    }
                                },
                                // {
                                //     title: 'کد اختصاصی',
                                //     value: (drug) => order.PriceSettings ? order.PriceSettings.Code : '',
                                //     style: {
                                //         'background': '#A1DFFB88'
                                //     }
                                // },
                                {
                                    title: 'کد جنریک',
                                    value: (drug) => drug.Drug.GenericCode,
                                    style: {
                                        'background': '#A1DFFB88'
                                    }
                                },
                                {
                                    title: 'عملیات',
                                    value: (row) => {
                                        return (<React.Fragment>
                                            {authenticationService.isInRole(roles.admin) &&
                                                <Button className={netDrugStyles.gradientCircleButtonPrimary}
                                                    component={Link} to={`/drug/${row.Drug.Id}/details`}
                                                    style={{ margin: '5px' }}>

                                                    <Tooltip title="مشاهده جزئیات">
                                                        < DetailsRoundedIcon />
                                                    </Tooltip>
                                                </Button>}
                                            {authenticationService.isInRole(roles.admin) &&
                                                <Button className={netDrugStyles.gradientCircleButtonPrimary}
                                                    component={Link} to={`/drug/${row.Drug.Id}/edit`} >

                                                    <Tooltip title="ویرایش">
                                                        < EditRoundedIcon />
                                                    </Tooltip>
                                                </Button>}
                                            {authenticationService.isInRole(roles.drugStoreOwner) &&
                                                <Button className={netDrugStyles.gradientCircleButtonPrimary}
                                                    onClick={async () => {
                                                        try {
                                                            setIsSaving(true);
                                                            setCurrentDrug(row);
                                                            const drugId = row.Drug.Id;
                                                            const response = await drugService.toggleHideDrug(drugId, drugStoreHelper.getDrugStoreId());
                                                            if (!response) {

                                                                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
                                                            }
                                                            else {
                                                                try {
                                                                    enqueueSnackbar('عملیات با موفقیت انجام شد', { variant: 'success' });
                                                                    return response.Data;
                                                                } catch (error) {
                                                                    enqueueSnackbar("خطا در دریافت اطلاعات از سرور", { variant: 'error' });
                                                                }
                                                            }

                                                        } catch (error) {
                                                            setSearchClicked(false);
                                                            console.log(error);
                                                            if (error == 'TypeError: Failed to fetch') {
                                                                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
                                                            }
                                                        }
                                                        finally {
                                                            setSearchClicked(false);
                                                            setIsSaving(false);
                                                            setCurrentDrug(null);
                                                        }
                                                    }}
                                                    style={{ margin: '5px' }}
                                                    disabled={isSaving} >

                                                    {(isSaving && row.Drug.Id === currentDrug.Drug.Id) ?
                                                        <CircularProgress size={24} /> :
                                                        <Tooltip title={
                                                            row.PriceSettings &&
                                                                row.PriceSettings.IsHidden ? 'نمایش دارو' : 'مخفی کردن دارو'}>


                                                            <React.Fragment>
                                                                {((!currentDrug || currentDrug.Drug.Id !== row.Drug.Id) &&
                                                                    row.PriceSettings &&
                                                                    row.PriceSettings.IsHidden) ?
                                                                    icons.visibilityRoundedIcon('white'):
                                                                    icons.visibilityOffIcon('white')}

                                                                {((currentDrug && currentDrug.Drug.Id === row.Drug.Id) &&
                                                                    row.PriceSettings &&
                                                                    !row.PriceSettings.IsHidden) ?
                                                                    icons.visibilityOffIcon('white') :
                                                                    ''}
                                                                {((currentDrug && currentDrug.Drug.Id === row.Drug.Id) &&
                                                                    row.PriceSettings &&
                                                                    row.PriceSettings.IsHidden) ?
                                                                    icons.visibilityRoundedIcon('white') :
                                                                    ''}

                                                            </React.Fragment>




                                                        </Tooltip>}
                                                </Button>}
                                        </React.Fragment>);
                                    },
                                    style: {
                                        'background': '#A1DFFB88',
                                        'width': '200px'
                                    },
                                    isAction: true
                                },

                            ]}
                            pageLoader={loadDrugs}
                            query={searchClicked ? searchQuery : ''}
                            maxHeight='800px'

                        //initialSelectedItems={cancelDrugSelection ? addedDrugs : null}
                        //initialSelectedItemsCallback={() => setCancelDrugSelection(false)}
                        ></PagedTable>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}