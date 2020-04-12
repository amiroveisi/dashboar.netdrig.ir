import React, { useState, useEffect, useRef } from 'react';
import { Grid, Paper, Typography, Button, TextField, FormControl, IconButton, Tooltip, FormGroup, Fab, Divider, CardContent, Card, CardActions, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { grey, blue } from '@material-ui/core/colors';
import InfoCard from '../../Components/InfoCard';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import AssignmentRoundedIcon from '@material-ui/icons/AssignmentRounded';
import noImage from '../../Assets/Images/no-image.jpg';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { Redirect } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PagedTable from '../../Components/PagedTable';
import SimpleList from '../../Components/SimpleList';
import CloseIcon from '@material-ui/icons/Close';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useNetDrugStyles from '../../Components/Styles';
import ArrowLeftRoundedIcon from '@material-ui/icons/ArrowLeftRounded';
import ReciepCard from '../../Components/ReciepCard';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import Collapsible from 'react-collapsible';
import PlaylistAddCheckRoundedIcon from '@material-ui/icons/PlaylistAddCheckRounded';
import * as drugStoreHelper from '../../Helpers/DrugStoreHelper';
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
    },
    grid: {
        padding: theme.spacing(2),

    }
}));
const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function PackagePrepare(props) {
    const classes = useStyles();
    const netDrugStyles = useNetDrugStyles();
    const [addedDrugs, setAddedDrugs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [canClearSearch, setCanclearSearch] = useState(false);
    const [order, setOrder] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [numberDialogOpen, setNumberDialogOpen] = useState(false);
    const [currentDrugCount, setCurrentDrugCount] = useState(1);
    const [currentDrugPrice, setCurrentDrugPrice] = useState(0);
    const [currentDrugInsuranceShare, setCurrentDrugInsuranceShare] = useState(0);
    const [currentDrugOrganizationShare, setCurrentDrugOrganizationShare] = useState(0);
    const [currentDrugDifferenceValue, setCurrentDrugDifferenceValue] = useState(0);
    const pagedTableRef = useRef();
    const [tempSelectedItems, setTempSelectedItems] = useState([]);
    const [currentSelectedItem, setCurrentSelectedItem] = useState({});
    const [cancelDrugSelection, setCancelDrugSelection] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [packageCreatedSuccessfuly, setPackageCreatedSuccessfuly] = useState(false);
    const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
    const [imageHeight, setImageHeight] = useState(0);
    const infoCardRef = useRef(null);
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        const orderId = props.match.params.orderId;
        if (!order)
            loadOrder(orderId, abortSignal);

        //useEffect's cleanup
        return () => { abortController.abort() };
    }, []);
    const loadDrugs = async function (page, rowsInPage) {
        try {

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/crawler/drug/getpaged?pagenumber=${page}&rowsinpage=${rowsInPage}&query=${searchQuery}&drugstoreid=${drugStoreHelper.getDrugStoreId()}`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    }
                });
            if (!response) {
                setSearchClicked(false);
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else if (response.status === 401) {
                setSearchClicked(false);
                enqueueSnackbar("شما وارد حساب کاربری خود نشده اید یا دسترسی به این بخش ندارید", { variant: 'error' });

            }
            else {
                try {
                    const serverData = await response.json();
                    setSearchClicked(false);
                    if (serverData && serverData.Data && serverData.Code === '0') {
                        return Promise.resolve({ data: serverData.Data.CurrentPageData, totalCount: serverData.Data.TotalRows });
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات داروخانه. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
                    }

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
    const loadOrder = async function (orderId, cancellationToken) {
        try {

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/orders/${orderId}`,
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
                        setOrder(serverData.Data);
                        if (serverData.Data.OrderItems) {
                            setImageHeight(document.getElementById('infoCard').clientHeight);
                            setAddedDrugs(serverData.Data.OrderItems.map(orderItem => ({
                                Drug: {
                                    GenericNameFarsi: orderItem.Name,
                                    GenericNameEnglish: orderItem.GenericName,
                                    Id: orderItem.DrugId
                                },
                                Info: {
                                    Producer: orderItem.Producer,
                                    Id: orderItem.CommercialInfoId
                                },
                                Price: orderItem.Price,
                                Quantity: orderItem.Quantity
                            })));
                            setCancelDrugSelection(true);
                        }
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
    const finishPacking = async function () {
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/orders/${order.Id}/package`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    },
                    body: JSON.stringify(addedDrugs.map(drug => ({
                        Name: drug.Drug.GenericNameFarsi,
                        GenericName: drug.Drug.GenericNameEnglish,
                        Price: drug.Price,
                        Quantity: drug.Quantity,
                        Producer: drug.Info.Producer,
                        CommercialInfoId: drug.Info.Id,
                        DrugId: drug.Drug.Id
                    })))
                });
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
                        setPackageCreatedSuccessfuly(true);
                        enqueueSnackbar('سفارش با موفقیت تکمیل و برای کاربر ارسال گردید. منتظر تایید کاربر باشید', { variant: 'success' });
                    }
                    else {
                        enqueueSnackbar("خطا در تکمیل سفارش. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
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
    const search = () => {
        setSearchClicked(true);
        if (canClearSearch) {
            setSearchQuery(' ');
        }
        setCanclearSearch(!canClearSearch);
    }
    const handleNumberDialogClose = () => {
        setNumberDialogOpen(false);
        setCancelDrugSelection(true);

    }
    const handleNumberdialogConfirmation = () => {
        setNumberDialogOpen(false);
        let tempCurrentItem = currentSelectedItem;
        tempCurrentItem.Quantity = currentDrugCount;
        tempCurrentItem.Price = currentDrugPrice;
        tempCurrentItem.InuranceShare = currentDrugInsuranceShare;
        tempCurrentItem.OrganizationShare = currentDrugOrganizationShare;
        tempCurrentItem.DifferenceValue = currentDrugDifferenceValue;
        setCurrentSelectedItem(tempCurrentItem);
        let copyOfTempSelectedItems = [];
        copyOfTempSelectedItems = copyOfTempSelectedItems.concat(tempSelectedItems);
        copyOfTempSelectedItems.push(currentSelectedItem);
        setAddedDrugs(copyOfTempSelectedItems);
    }
    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }

    if (!order) {
        return (<p>در حال بارگذاری...</p>);
    }
    if (packageCreatedSuccessfuly) {
        return (<Redirect to='/orders' />);
    }
    const infoCardsBreakPoints = {
        xs: 12,
        sm: 6,
        md: 3,

    };
    const orderInfoData = (
        <React.Fragment>
            {order.CustomerFullName} <br />
            {order.CreatedOn}
        </React.Fragment>
    )
    const infoHeaderClosedState = (
        <Card id='infoCard'>
            <CardContent>
                <Grid item container justify='space-between' xs={12}>
                    <Grid item spacing={1} container alignContent='center' style={{ width: 'auto' }}>
                        <Grid item>
                            <PersonRoundedIcon style={{ color: '#4fc3f788' }} />
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>سفارش دهند</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>{order.CustomerFullName || 'نامشخص'}</Typography>
                    </Grid>
                </Grid>
                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                <Grid item container justify='space-between' xs={12}>
                    <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                        <Grid item>
                            <EventIcon style={{ color: '#4fc3f788' }} />
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>تاریخ ثبت سفارش</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>{order.CreatedOn || 'نامشخص'}</Typography>
                    </Grid>
                </Grid>
                <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                <Grid item container justify='space-between' xs={12}>
                    <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                        <Grid item>
                            <LocalOfferIcon style={{ color: '#4fc3f788' }} />
                        </Grid>
                        <Grid item>
                            <Typography variant='caption'>شماره سفارش</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography variant='caption'>{order.Code || 'نامشخص'}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button startIcon={<ExpandMoreRoundedIcon />}
                    className={netDrugStyles.gradientButtonPrimaryFlat}
                    aria-label="جزئیات بیشتر" onClick={() => setIsDetailCardOpen(!isDetailCardOpen)}>
                    <Typography variant='caption'>
                        اطلاعات بیشتر
                    </Typography>
                </Button>
            </CardActions>
        </Card>
    );

    return (

        <div className={classes.root}>
            <Grid container className={classes.grid} spacing={2}>
                <Grid container item spacing={2}>
                    <Grid item container justify='space-between' xs={12} sm={12} md={8} spacing={1}
                    >
                        <Collapsible ref={infoCardRef} trigger={infoHeaderClosedState}
                            open={isDetailCardOpen}
                            triggerDisabled={true}
                            triggerWhenOpen={<div />}
                            overflowWhenOpen='inherit'
                            containerElementProps={{
                                id: 'collapsibleCard',
                                style: {
                                    'width': '100%'
                                }
                            }}

                        >
                            <Card id='infoCard'>
                                <CardContent>
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container alignContent='center' style={{ width: 'auto' }}>
                                            <Grid item>
                                                <PersonRoundedIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>سفارش دهند</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.CustomerFullName || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <EventIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>تاریخ ثبت سفارش</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.CreatedOn || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <LocalOfferIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>شماره سفارش</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.Code || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <BusinessCenterIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>نحوه دریافت</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.DeliveryType || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <AssignmentRoundedIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>وضعیت سفارش</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.LastStatus || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <ScheduleIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>زمان تقریبی دریافت سفارش</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.DeliveryApproximateTime || 'نامشخص'}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                                    <Grid item container justify='space-between' xs={12}>
                                        <Grid item spacing={1} container style={{ width: 'auto' }} alignContent='center'>
                                            <Grid item>
                                                <LocationOnRoundedIcon style={{ color: '#4fc3f788' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant='caption'>آدرس</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{order.Address && order.Address.AddressText || 'بدون آدرس'}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions >
                                    {isDetailCardOpen ? (<CardActions>
                                        <Button
                                            className={netDrugStyles.gradientButtonPrimaryFlat}
                                            startIcon={<ExpandLessRoundedIcon />}
                                            id='toggler' aria-label="جزئیات کمتر"
                                            onClick={() => setIsDetailCardOpen(!isDetailCardOpen)}>
                                            <Typography variant='caption'>
                                                اطلاعات کمتر
                                           </Typography>
                                        </Button>
                                    </CardActions>) : <div />}
                                </CardActions>
                            </Card>

                        </Collapsible >
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} spacing={1}>
                        <Card style={{ height: imageHeight }}>
                            <CardContent>
                                <Tooltip title='جهت نمایش تصویر بزرگتر کلیک کنید'>
                                    <img src={order.PrescriptionImageData ? order.PrescriptionImageData : noImage}
                                        onClick={() => setImageDialogOpen(true)}
                                        alt='تصویر دارو/نسخه'
                                        style={{ cursor: 'zoom-in', height: imageHeight - 32 }} />
                                </Tooltip>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item container xs={12} className={classes.grid} spacing={2} alignItems='flex-end' justify='flex-end'>
                    <Grid item xs={12}>
                        {(!addedDrugs || addedDrugs.length === 0)
                            ?
                            <Typography variant='caption'>
                                لطفا دارو های مورد نظر خود را از لیست پایین انتخاب نمایید
                               </Typography>
                            :
                            <Grid container alignItems='flex-end' style={{ textAlign: 'right' }} spacing={1}>
                                <Grid item container spacing={1}>
                                    <Grid item style={{ textAlign: 'right' }}>
                                        <Typography variant='body1'>
                                            لیست دارو های انتخاب شده
                                    </Typography>
                                    </Grid>
                                    <Grid item container style={{ textAlign: 'left' }} spacing={1}>
                                        <Grid item>
                                            <Button className={netDrugStyles.gradientButtonPrimary} onClick={finishPacking}>
                                                سفارش تکمیل است
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button className={netDrugStyles.gradientButtonPrimaryOutlined} component={Link} to={`/orders/${order.Id}/details`}>
                                                بازگشت به جزئیات دارو
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button className={netDrugStyles.gradientButtonPrimaryOutlined} component={Link} to={`/dashboard`}>
                                                بازگشت به صفحه اصلی
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper>
                                        <SimpleList data={addedDrugs}
                                            //numberAvatar={true}
                                            defaultImage={<PlaylistAddCheckRoundedIcon />}
                                            primaryText={item => item.Drug.GenericNameFarsi}
                                            secondaryText={item => (
                                                <ul>
                                                    <li><Typography variant='caption'>
                                                        {`نام جنریک: ${item.Drug.GenericNameEnglish}`}
                                                    </Typography></li>
                                                    <li>
                                                        <Typography variant='caption'>
                                                            {`تولید کننده: ${item.Info.Producer}`}
                                                        </Typography>
                                                    </li>
                                                    <li>
                                                        <Typography variant='caption'>
                                                            {`تعداد: ${item.Quantity || 'تعداد نامشخص!'}`}
                                                        </Typography>
                                                    </li>
                                                    <li>
                                                        <Typography variant='caption'>
                                                            قیمت:
                                                        <span style={{ direction: 'ltr', marginRight: '5px', marginLeft: '5px' }}>{item.Price}</span>
                                                            x
                                                        <span style={{ direction: 'ltr', marginRight: '5px', marginLeft: '5px' }}>{item.Quantity}</span>
                                                            =
                                                        <span style={{ direction: 'ltr', marginRight: '5px', marginLeft: '5px' }}>{item.Price * item.Quantity}</span>
                                                            ریال
                                                   </Typography>
                                                    </li>
                                                </ul>
                                            )}
                                            actions={[
                                                {
                                                    label: 'حذف از لیست',
                                                    icon: <CloseIcon />,
                                                    //customClass:netDrugStyles.secondaryFlat,
                                                    onClick: item => {
                                                        let itemIndex = addedDrugs.indexOf(addedDrugs.filter(drug => drug.Drug.Id === item.Drug.Id)[0]);
                                                        let newAddedDrugs = [];
                                                        if (itemIndex !== -1) {
                                                            newAddedDrugs = newAddedDrugs.concat(addedDrugs.slice(0, itemIndex));
                                                            newAddedDrugs = newAddedDrugs.concat(addedDrugs.slice(itemIndex + 1));
                                                            setAddedDrugs(newAddedDrugs);
                                                            setCancelDrugSelection(true);
                                                        }
                                                    }
                                                }
                                            ]}></SimpleList>
                                    </Paper>
                                </Grid>

                            </Grid>
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} md={2} style={{ textAlign: 'right' }}>
                        <Typography variant='body1'>
                            لیست دارو ها
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={9}>
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
                    <Grid item xs={1} style={{ textAlign: 'right' }}>
                        <Tooltip title={canClearSearch ? 'لغو جستجو' : 'جستجو'}>
                            <IconButton color='primary' onClick={search} className={netDrugStyles.primaryFlat}>
                                {canClearSearch ? <ClearRoundedIcon color='secondary' /> : <SearchRoundedIcon color='primary' />}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <PagedTable
                            dataId={(order) =>
                                order.Drug ? `${order.Drug.Id}-${order.Info && order.Info.Id}`
                                    : `${order.DrugId}-${order.CommercialInfoId}`}
                            selectable={true}
                            selectionChanged={(items => {
                                let copyOfAddedItems = [];
                                copyOfAddedItems = copyOfAddedItems.concat(items);
                                // console.log('items: ', items);
                                // console.log('current added: ', addedDrugs);
                                if (items.length > addedDrugs.length) //checked
                                {
                                    let lastSelectedItem = copyOfAddedItems.pop();
                                    if (addedDrugs.filter(drug => drug.Drug.Id === lastSelectedItem.Drug.Id).length <= 0) {
                                        setCurrentSelectedItem(lastSelectedItem);
                                        setTempSelectedItems(copyOfAddedItems);
                                        setCurrentDrugCount(1);
                                        setCurrentDrugPrice(0);
                                        setNumberDialogOpen(true);
                                    }
                                }
                                else if (items.length <= addedDrugs.length) {
                                    setAddedDrugs(copyOfAddedItems);
                                }
                            })}
                            rowsPerPageOptions={[4, 25, 50, 100]}
                            headers={[
                                {
                                    title: 'نام فارسی',
                                    value: (order) => order.Drug.GenericNameFarsi,
                                    style:{
                                        'background' : '#A1DFFB88'
                                    }
                                },
                                {
                                    title: 'نام لاتین',
                                    value: (order) => order.Drug.GenericNameEnglish,
                                    style:{
                                        'background' : '#A1DFFB88'
                                    }
                                },
                                {
                                    title: 'تولید کننده',
                                    value: (order) => order.Info.Producer,
                                    style:{
                                        'background' : '#A1DFFB88'
                                    }
                                }
                            ]}
                            pageLoader={loadDrugs}
                            query={searchClicked ? searchQuery : ''}
                            maxHeight='380px'
                            initialSelectedItems={cancelDrugSelection ? addedDrugs : null}
                            initialSelectedItemsCallback={() => setCancelDrugSelection(false)}
                        ></PagedTable>
                    </Grid>
                </Grid>

            </Grid>
            <Dialog open={numberDialogOpen} onClose={handleNumberDialogClose} aria-labelledby="ورود تعداد دارو">
                <DialogTitle id="form-dialog-title">{currentSelectedItem.Drug ? currentSelectedItem.Drug.GenericNameFarsi : 'اطاعات تکمیلی'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        لطفا اطلاعات زیر را تکمیل کنید:
                    </DialogContentText>
                    <Grid container direction='column' spacing={2}>
                        <Grid item>
                            <FormControl fullWidth>
                                <TextField
                                    autoFocus
                                    id="quantity"
                                    label="تعداد"
                                    type="text"
                                    value={currentDrugCount}
                                    onChange={(event) => {
                                        if (event.target.value && !isNaN(event.target.value))
                                            setCurrentDrugCount(event.target.value)

                                    }}
                                    onFocus={event => event.target.select()}
                                    onKeyPress={(event) => {
                                        // //console.log('key: ', event.charCode);
                                        if (event.charCode === ConstantValues.EnterKey) //enter
                                            handleNumberdialogConfirmation();
                                        else if (event.charCode === ConstantValues.EscapeKey) //escape
                                            handleNumberDialogClose();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <TextField
                                    id="price"
                                    label="مبلغ واحد"
                                    type="text"
                                    value={currentDrugPrice}
                                    onChange={(event) => {
                                        if (event.target.value && !isNaN(event.target.value))
                                            setCurrentDrugPrice(event.target.value)

                                    }}
                                    onFocus={event => event.target.select()}
                                    onKeyPress={(event) => {
                                        // //console.log('key: ', event.charCode);
                                        if (event.charCode === ConstantValues.EnterKey) //enter
                                            handleNumberdialogConfirmation();
                                        else if (event.charCode === ConstantValues.EscapeKey) //escape
                                            handleNumberDialogClose();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <TextField
                                    id="insuranceShare"
                                    label="سهم بیمه"
                                    type="text"
                                    value={currentDrugInsuranceShare}
                                    onChange={(event) => {
                                        if (event.target.value && !isNaN(event.target.value))
                                            setCurrentDrugInsuranceShare(event.target.value)

                                    }}
                                    onFocus={event => event.target.select()}
                                    onKeyPress={(event) => {
                                        // //console.log('key: ', event.charCode);
                                        if (event.charCode === ConstantValues.EnterKey) //enter
                                            handleNumberdialogConfirmation();
                                        else if (event.charCode === ConstantValues.EscapeKey) //escape
                                            handleNumberDialogClose();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <TextField
                                    id="organizationShare"
                                    label="سهم سازمان"
                                    type="text"
                                    value={currentDrugOrganizationShare}
                                    onChange={(event) => {
                                        if (event.target.value && !isNaN(event.target.value))
                                            setCurrentDrugOrganizationShare(event.target.value)

                                    }}
                                    onFocus={event => event.target.select()}
                                    onKeyPress={(event) => {
                                        // console.log('key: ', event.charCode);
                                        if (event.charCode === ConstantValues.EnterKey) //enter
                                            handleNumberdialogConfirmation();
                                        else if (event.charCode === ConstantValues.EscapeKey) //escape
                                            handleNumberDialogClose();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <TextField
                                    id="differenceValue"
                                    label="اضافه مبلغ"
                                    type="text"
                                    value={currentDrugDifferenceValue}
                                    onChange={(event) => {
                                        if (event.target.value && !isNaN(event.target.value))
                                            setCurrentDrugDifferenceValue(event.target.value)

                                    }}
                                    onFocus={event => event.target.select()}
                                    onKeyPress={(event) => {
                                        // console.log('key: ', event.charCode);
                                        if (event.charCode === ConstantValues.EnterKey) //enter
                                            handleNumberdialogConfirmation();
                                        else if (event.charCode === ConstantValues.EscapeKey) //escape
                                            handleNumberDialogClose();
                                    }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNumberDialogClose} color="secondary">
                        انصراف
                    </Button>
                    <Button onClick={handleNumberdialogConfirmation} color="primary">
                        تایید
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={imageDialogOpen} aria-labelledby="تصویر نسخه" fullWidth maxWidth="lg">
                <DialogTitle id="form-dialog-title">
                    <Grid container justify='space-between'>
                        <Grid item style={{ textAlign: 'right' }}>
                            تصویر نسخه
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
                            <img src={order.PrescriptionImageData ? order.PrescriptionImageData : noImage}
                                onClick={() => setImageDialogOpen(false)}
                                alt='تصویر دارو/نسخه' height='480px'
                                style={{ cursor: 'zoom-out' }} />
                        </Grid>
                    </Grid>


                </DialogContent>

            </Dialog>

        </div>
    );
}