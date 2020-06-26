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

export default function ReadytoAcceptOrders() {
    const [orders, setOrders] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
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

            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/orders/readyToAccept`,
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

    return (
        <SimpleList data={orders}
            primaryText={(order) => `${order.Address && order.Address.AddressText || 'بدون آدرس'} - ${order.CustomerFullName || '(بدون نام)'}`}
            secondaryText={(order) => `${order.Address && order.Address.PhoneNumber || 'بدون شماره تلفن'} - #${order.Code || '0000'}`}
            actions={[
                // {
                //     label: 'پذیرش سفارش',
                //     link: function (order) { return `/orders/${order.Id}/confirm` },
                //     icon: <CheckRoundedIcon />,
                //     color: 'primary',
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
                    icon: <DetailsRoundedIcon />,
                }
            ]}

            defaultImage={<LocalOfferIcon />} />
    );
}