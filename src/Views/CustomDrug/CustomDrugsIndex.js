import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography, Tooltip } from '@material-ui/core';
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
export default function CustomDrugsIndex() {
    const netDrugStyles = useNetDrugStyles();
    const [dataIsEmpty, setDataIsEmpty] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [canClearSearch, setCanclearSearch] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const noDataView = (<h6>اطلاعاتی برای نمایش وجود ندارد</h6>);

    const loadCustomDrugs = async function (page, rowsInPage) {
        try {
            let normalizedQuery = searchQuery ? searchQuery.trim() : '';

            const response = await drugService.getCustomDrugs(page, rowsInPage, normalizedQuery, drugStoreHelper.getDrugStoreId());
            if (!response) {
                setSearchClicked(false);
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    setSearchClicked(false);
                    return { data: response.Data.CurrentPageData, totalCount: response.Data.TotalRows }
                } catch (error) {
                    setSearchClicked(false);
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
    return (
        <div className={classes.root}>
            <Container className="h-100" >
                <Grid container className={classes.grid} style={{ marginTop: '30px' }} direction="column" xs={12} justify="center" alignItems="stretch" >
                    <Grid item xs={12}>
                        <Typography component="h3">
                            لیست داروهای اختصاصی
                        </Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button className={netDrugStyles.gradientButtonPrimaryOutlined} startIcon={<Add />} component={Link} to="/customdrug/new">داروی جدید</Button>
                        </Grid>
                    </Grid>
                    <Grid item style={{ marginTop: '10px' }}>
                        <PagedTable
                            dataId={(drug) =>
                                `${drug.Id}`}
                            selectable={false}
                            rowsPerPageOptions={[25, 50, 100, 200]}
                            headers={[
                                {
                                    title: 'وضعیت',
                                    value: (row) => row.Drug.IsConfirmed ? 'تایید شده' : 'تایید نشده',

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
                                            <Button className={netDrugStyles.gradientCircleButtonPrimary}
                                                component={Link} to={`/customdrug/${row.Drug.Id}/details`}
                                                style={{ margin: '5px' }}>

                                                <Tooltip title="مشاهده جزئیات">
                                                    < DetailsRoundedIcon />
                                                </Tooltip>
                                            </Button>
                                            {(!row.Drug.IsConfirmed || authenticationService.isInRole(roles.admin)) && <Button className={netDrugStyles.gradientCircleButtonPrimary}
                                                component={Link} to={`/customdrug/${row.Drug.Id}/edit`} >

                                                <Tooltip title="ویرایش">
                                                    < EditRoundedIcon />
                                                </Tooltip>
                                            </Button>}
                                        </React.Fragment>);
                                    },
                                    style: {
                                        'background': '#A1DFFB88'
                                    },
                                    isAction: true
                                },

                            ]}
                            pageLoader={loadCustomDrugs}
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