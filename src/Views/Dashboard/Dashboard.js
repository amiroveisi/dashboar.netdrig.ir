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
                        <Tab label="سفارش های در حال انجام" />
                        <Tab label="سفارش های انجام شده" />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                       <ReadytoAcceptOrders/>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item 2
            </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item 3
            </TabPanel>
                </Grid>
            </Grid>
        </div>
    );
}