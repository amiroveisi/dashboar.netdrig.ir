import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { grey } from '@material-ui/core/colors';
import InfoCard from '../../Components/InfoCard';
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
    },
    grid: {
        padding: theme.spacing(2),

    }
}));

export default function OrderDetails(props) {
    const classes = useStyles();
    const orderItems = [
        {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de5",
            "Name": "داروی 1",
            "Quantity": 1,
            "Price": 15000,
            "ImageData": null,
            "Description": "توضیحات داروی 1",
            "Id": "d410c23c-7910-ea11-8115-005056087de5",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        },
        {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        },
        {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        },
        {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }, {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }
        , {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }, {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }, {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }, {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }, {
            "OrderId": "d310c23c-7910-ea11-8115-005056087de6",
            "Name": "داروی 2",
            "Quantity": 3,
            "Price": 34000,
            "ImageData": null,
            "Description": "توضیحات داروی 2",
            "Id": "d410c23c-7910-ea11-8115-005056087de3",
            "CreatedOn": null,
            "LastModifiedOn": null,
            "CreatedOnTicks": 0,
            "LastModifiedOnTicks": 0,
            "LastModifiedBy": null
        }
    ];

    return (
        <div className={classes.root}>
            <Grid container className={classes.grid} spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard title='تاریخ ثبت سفارش' data='1398/10/2'
                        icon={<EventIcon style={{ color: grey[400] }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard title='شماره سفارش' data='#4321'
                        icon={<LocalOfferIcon style={{ color: grey[400] }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard title='نحوه دریافت' data='در محل داروخانه'
                        icon={<BusinessCenterIcon style={{ color: grey[400] }} />} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <InfoCard title='زمان تقریبی دریافت سفارش' data='از 10 صبح الی 11 صبح'
                        icon={<ScheduleIcon style={{ color: grey[400] }} />} />
                </Grid>

            </Grid>
            <Grid container xs={12} className={classes.grid}>
                <Grid item style={{width:'100%'}}>
                    <TableContainer style={{maxHeight:'400px'}} component={Paper}>
                        <Table stickyHeader className={classes.table} aria-label="اقلام سفارش">
                            <TableHead>
                                <TableRow>
                                    <TableCell>عنوان</TableCell>
                                    <TableCell align="right">تعداد</TableCell>
                                    <TableCell align="right">قیمت</TableCell>
                                    <TableCell align="right">توضیحات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orderItems.map(orderItem => (
                                    <TableRow key={orderItem.Id}>
                                        <TableCell component="th" scope="row">
                                            {orderItem.Name}
                                        </TableCell>
                                        <TableCell align="right">{orderItem.Quantity}</TableCell>
                                        <TableCell align="right">{orderItem.Price}</TableCell>
                                        <TableCell align="right">{orderItem.Description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
}