import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import SimpleList from '../../Components/SimpleList';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import CloseIcon from '@material-ui/icons/Close';
import DetailsRoundedIcon from '@material-ui/icons/DetailsRounded';
import LocalMallRoundedIcon from '@material-ui/icons/LocalMallRounded';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
    },
    grid: {
        padding: theme.spacing(2)
    }
}));
const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function AcceptedOrders() {
    const [orders, setOrders] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [noData, setNoData] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        if (!orders)
            loadOrders(abortSignal);
        //useEffect's cleanup
        return () => { abortController.abort() };
    }, []);
    const loadOrders = async function (cancellationToken) {
        try {

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/orders/accepted`,
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
                        setOrders(serverData.Data);
                    }
                    else if (serverData && serverData.Code === '1005') //no drugstore found for this user
                        setNoData(true);
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
   
    

    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }
    if (noData) {
        return (<h6>اطلاعاتی برای نمایش وجود ندارد</h6>);
    }
    return (
        <SimpleList data={orders}
            primaryText={(order) => `${order.Address.AddressText || 'بدون آدرس'} - ${order.CustomerFullName || '(بدون نام)'}`}
            secondaryText={(order) => `${order.Address.PhoneNumber || 'بدون شماره تلفن'} - #${order.Code || '0000'}`}
            actions={[
                // {
                //     label: 'شروع آماده سازی',
                //     link: function (order) { return `/orders/${order.Id}/confirm` },
                //     icon: <LocalMallRoundedIcon />,
                //     color: 'primary'
                // },
                // {
                //     label: 'رد سفارش',
                //     link: function (order) { return `/orders/${order.Id}/decline` },
                //     icon: <CloseIcon />,
                //     color: 'secondary'
                // },
                {
                    label: 'جزئیات سفارش',
                    link: function (order) { return `/orders/${order.Id}/details` },
                    icon: <DetailsRoundedIcon />
                }
            ]}

            defaultImage={<LocalOfferIcon />} />
    );
}