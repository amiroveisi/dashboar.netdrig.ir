import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { grey } from '@material-ui/core/colors';
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
export default function OrderDetails(props) {
    const classes = useStyles();
    const [order, setOrder] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        const orderId = props.match.params.orderId;
        if (!order)
            loadOrder(orderId, abortSignal);
        //useEffect's cleanup
        return () => { abortController.abort() };
    }, []);
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
    const confirmOrder = async function () {
        try {
            let orderId = order.Id;
            console.log('confirm clicked');
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/orders/${orderId}/confirm`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    },

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
                        setOrderConfirmed(true);
                        setOrder(serverData.Data);
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات سفارش. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
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
    const cancelOrder = async function () {
        try {
            let orderId = order.Id;
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/orders/${orderId}/cancel`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    },

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
                        setOrderConfirmed(true);
                        setOrder(serverData.Data);
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات سفارش. لطفا صفحه را مجددا بارگذاری نمایید", { variant: 'warning' });
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

    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }
    // if (orderConfirmed) {
    //     return (<Redirect to='/dashboard' />);
    // }
    if (!order) {
        return (<p>در حال بارگذاری...</p>);
    }
    return (

        <div className={classes.root}>
            <Grid contaienr className={classes.grid} spacing={2}>
                <Grid container spacing={3}>
                    <Grid item container xs={12} sm={6} md={3} spacing={0}>
                        <Grid item xs={12}>
                            <InfoCard title='سفارش دهنده' data={order.CustomerFullName || 'نامشخص'}
                                icon={<PersonRoundedIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='تاریخ ثبت سفارش' data={order.CreatedOn || 'نامشخص'}
                                icon={<EventIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='شماره سفارش' data={order.Code || 'ندارد'}
                                icon={<LocalOfferIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='نحوه دریافت' data={order.DeliveryType || 'نامشخص'}
                                icon={<BusinessCenterIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='وضعیت سفارش' data={order.LastStatus || 'نامشخص'}
                                icon={<AssignmentRoundedIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='زمان تقریبی دریافت سفارش' data={order.DeliveryApproximateTime || 'نامشخص'}
                                icon={<ScheduleIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoCard title='آدرس' data={order.Address && order.Address.AddressText || 'بدون آدرس'}
                                icon={<LocationOnRoundedIcon style={{ color: grey[400] }} />} />
                            <Divider variant='middle' />
                        </Grid>
                        <Grid container item spacing={1} style={{ marginTop: '10px' }}>
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
                        </Grid>

                    </Grid>
                    <Grid item container xs={12} sm={6} md={9} className={classes.grid} spacing={2}>
                        <Grid item xs={12} style={{ background: grey[100] }}>
                            <img src={order.PrescriptionImageData ? order.PrescriptionImageData : noImage} alt='تصویر دارو/نسخه' height='600px' />

                        </Grid>
                        {/* <Grid item xs={12} style={{marginTop:'20px'}}>
                            <Typography variant='caption'>
                                سابقه سفارشات کاربر
                            </Typography>
                        </Grid>
                        <Grid item style={{ width: '100%' }}>
                            <TableContainer style={{ maxHeight: '355px' }} component={Paper}>
                                <Table stickyHeader className={classes.table} aria-label="اقلام سفارش">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>تاریخ</TableCell>
                                            <TableCell >دارای نسخه</TableCell>
                                            <TableCell >قیمت</TableCell>
                                            <TableCell >وضعیت</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderItems.map(orderItem => (
                                            <TableRow key={orderItem.Id}>
                                                <TableCell component="th" scope="row">
                                                    {orderItem.Name}
                                                </TableCell>
                                                <TableCell >{orderItem.Quantity}</TableCell>
                                                <TableCell >{orderItem.Quantity}</TableCell>
                                                <TableCell >{orderItem.Description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>


        </div>
    );
}