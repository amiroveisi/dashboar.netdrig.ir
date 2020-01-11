import React, { useState, useEffect, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { Grid, Paper, Typography, Button, TextField, FormControl, IconButton, Tooltip } from '@material-ui/core';
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
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import OrderStatuses from '../../Helpers/OrderStatus';
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
    const [addedDrugs, setAddedDrugs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);
    const [canClearSearch, setCanclearSearch] = useState(false);
    const [order, setOrder] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [numberDialogOpen, setNumberDialogOpen] = useState(false);
    const [currentDrugCount, setCurrentDrugCount] = useState(0);
    const pagedTableRef = useRef();
    const [tempSelectedItems, setTempSelectedItems] = useState([]);
    const [currentSelectedItem, setCurrentSelectedItem] = useState({});
    const [cancelDrugSelection, setCancelDrugSelection] = useState(false);
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

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/crawler/drug/getpaged?pagenumber=${page}&rowsinpage=${rowsInPage}&query=${searchQuery}`,
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
    const search = () => {
        setSearchClicked(true);
        if (canClearSearch) {
            setSearchQuery(' ');
        }
        setCanclearSearch(!canClearSearch);
    }
    const handleNumberDialogClose = () => {
        setNumberDialogOpen(false);
        // setCurrentSelectedItem({});
        // setTempSelectedItems([]);
        setCancelDrugSelection(true);
    }
    const handleNumberdialogConfirmation = () => {
        setNumberDialogOpen(false);
        let tempCurrentItem = currentSelectedItem;
        tempCurrentItem.quantity = currentDrugCount;
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
    const infoCardsBreakPoints = {
        xs: 12,
        sm: 6,
        md: 3,

    };
    return (

        <div className={classes.root}>
            <Grid container className={classes.grid} spacing={2}>
                <Grid container spacing={2}>
                    <Grid item container xs={12} sm={12} md={12} lg={8} spacing={1}>
                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='سفارش دهنده' data={order.CustomerFullName || 'نامشخص'}
                                icon={<PersonRoundedIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='تاریخ ثبت سفارش' data={order.CreatedOn || 'نامشخص'}
                                icon={<EventIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='شماره سفارش' data={order.Code || 'ندارد'}
                                icon={<LocalOfferIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='نحوه دریافت' data={order.DeliveryType || 'نامشخص'}
                                icon={<BusinessCenterIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='وضعیت سفارش' data={order.LastStatus || 'نامشخص'}
                                icon={<AssignmentRoundedIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item {...infoCardsBreakPoints}>
                            <InfoCard background={grey[50]} title='زمان تقریبی دریافت سفارش' data={order.DeliveryApproximateTime || 'نامشخص'}
                                icon={<ScheduleIcon style={{ color: grey[400] }} />} />

                        </Grid>

                        <Grid item xs={6}>
                            <InfoCard background={grey[50]} title='آدرس' data={order.Address && order.Address.AddressText || 'بدون آدرس'}
                                icon={<LocationOnRoundedIcon style={{ color: grey[400] }} />} />
                        </Grid>

                        {/* <Grid container item spacing={1} style={{ marginTop: '10px' }}>
                            <Grid item xs={12}>
                                {order && order.LastStatus === OrderStatuses().WaitingToBeAcceptedByDrugStore &&
                                    <Button fullWidth variant='contained' onClick={confirmOrder}
                                        color='primary'>قبول کردن سفارش</Button>}
                                {order && order.LastStatus === OrderStatuses().Confirmed &&
                                    <Button fullWidth variant='contained' onClick={confirmOrder}
                                        color='primary'>شروع آماده سازی سفارش</Button>}
                            </Grid>
                            <Grid item xs={12}>
                               
                                {order && order.LastStatus === OrderStatuses().Confirmed &&
                                    <Button fullWidth variant='outlined' onClick={cancelOrder}
                                        color='secondary'>لغو سفارش</Button>}
                            </Grid>
                            <Grid item xs={12}>
                                <Button component={Link} to='/dashboard'
                                    fullWidth variant='outlined'
                                    color='default'>بازگشت به لیست سفارش ها</Button>
                            </Grid>
                        </Grid> */}

                    </Grid>
                    <Grid item xs={4} style={{ background: grey[100] }}>
                        <img src={order.PrescriptionImageData ? order.PrescriptionImageData : noImage} alt='تصویر دارو/نسخه' height='200px' />

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
                                <Grid item xs={12}>
                                    <Typography variant='body1'>
                                        لیست دارو های انتخاب شده
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Paper>
                                        <SimpleList data={addedDrugs}
                                            numberAvatar={true}
                                            primaryText={item => item.Drug.GenericNameFarsi}
                                            secondaryText={item => (
                                                <ul>
                                                    <li>{`نام جنریک: ${item.Drug.GenericNameEnglish}`}</li>
                                                    <li>{`تولید کننده: ${item.Info.Producer}`}</li>
                                                    <li>{`تعداد: ${item.quantity || 'تعداد نامشخص!'}`}</li>
                                                </ul>
                                            )}
                                            actions={[
                                                {
                                                    label: 'حذف از لیست',
                                                    icon: <CloseIcon />,
                                                    onClick: item => console.log('item clicked: ', item)
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

                            />
                        </FormControl>

                    </Grid>
                    <Grid item xs={1} style={{ textAlign: 'right' }}>
                        <Tooltip title={canClearSearch ? 'لغو جستجو' : 'جستجو'}>
                            <IconButton color='primary' onClick={search} onKeyPress={(event) => {
                                if (event.charCode === 13) {
                                    search();
                                }
                            }}>
                                {canClearSearch ? <ClearRoundedIcon color='secondary' /> : <SearchRoundedIcon color='primary' />}
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <PagedTable
                            dataId={(order) => `${order.Drug.Id}-${order.Info && order.Info.Id}`}
                            selectable={true}
                            selectionChanged={(items => {
                                let copyOfAddedItems = [];
                                copyOfAddedItems = copyOfAddedItems.concat(items);
                                console.log('items: ', items);
                                console.log('current added: ', addedDrugs);
                                if (items.length > addedDrugs.length) //checked
                                {
                                    
                                    setCurrentSelectedItem(copyOfAddedItems.pop());
                                    setTempSelectedItems(copyOfAddedItems);
                                    setNumberDialogOpen(true);
                                }
                                else if (items.length <= addedDrugs.length) {
                                    setAddedDrugs(copyOfAddedItems);
                                }
                            })}
                            rowsPerPageOptions={[4, 25, 50, 100]}
                            headers={[
                                {
                                    title: 'نام فارسی',
                                    value: (order) => order.Drug.GenericNameFarsi
                                },
                                {
                                    title: 'نام لاتین',
                                    value: (order) => order.Drug.GenericNameEnglish
                                },
                                {
                                    title: 'تولید کننده',
                                    value: (order) => order.Info.Producer
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
                <DialogTitle id="form-dialog-title">تعداد</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        لطفا تعداد داروی مورد نظر را وارد نمایید
                    </DialogContentText>
                    <TextField
                        autoFocus

                        id="quantity"
                        label="تعداد"
                        type="text"
                        fullWidth
                        value={currentDrugCount}
                        onChange={(event) => {
                            if (event.target.value && !isNaN(event.target.value))
                                setCurrentDrugCount(event.target.value)
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNumberDialogClose} color="primary">
                        انصراف
                    </Button>
                    <Button onClick={handleNumberdialogConfirmation} color="primary">
                        تایید
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}