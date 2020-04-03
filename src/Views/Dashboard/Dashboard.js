import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from '../../Components/TabPanel';
import ReadytoAcceptOrders from '../Order/ReadyToAcceptOrders';
import InProgressOrders from '../Order/AcceptedOrders';
import OrdersWaitingCustomerConfirmation from '../Order/OrdersWaitingCustomerConfirmation';
import OrdersNeedCorrection from '../Order/OrdersNeedCorrection';
import OrdersReadyToDelivery from '../Order/OrdersReadyToDelivery';

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

export default function Dashboard() {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const handleChange = (event, index) => {
        setValue(index);
        console.log(index);
    }

    return (
        <div className={classes.root}>
            <Grid container className={classes.grid}>
                <Grid item xs={12}>
                    <Tabs value={value} onChange={handleChange} >
                        <Tab label="سفارش های قابل پذیرش" />
                        <Tab label="سفارش های پذیرفته شده" />
                        <Tab label="سفارش های منتظر تایید مشتری" />
                        <Tab label="درخواست های اصلاح سفارش مشتری" />
                        <Tab label="سفارش های آماده ارسال" />
                        <Tab label="سفارش های ارسال شده" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <ReadytoAcceptOrders />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <InProgressOrders />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <OrdersWaitingCustomerConfirmation />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <OrdersNeedCorrection/>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <OrdersReadyToDelivery/>
                    </TabPanel>
                    
                </Grid>
            </Grid>
        </div>
    );
}