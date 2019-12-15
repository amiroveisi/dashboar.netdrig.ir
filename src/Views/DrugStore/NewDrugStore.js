import React, { useState, useEffect } from 'react';
import * as DrugStoreModel from '../../Models/DrugStoreModel';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Link as RouterLink } from 'react-router-dom';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { useSnackbar } from 'notistack';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Edit from '@material-ui/icons/Edit';
import Clear from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import { Redirect } from 'react-router-dom';

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
export default function NewDrugStore() {
    const classes = useStyles();
    const [newDrugStore, setNewDrugStore] = useState(DrugStoreModel);
    const [success, setSuccess] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [users, setUsers] = useState(null);
    const [manualOwnerEntry, setManualOwnerEntry] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        loadUsers(abortSignal);
        //useEffect's cleanup
        return () => { abortController.abort() };

    }, []);
    const submitNewDrugStore = async function () {
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/drugstore`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    },
                    body: JSON.stringify({
                        Name: newDrugStore.Name,
                        Address: newDrugStore.Address,
                        Email: newDrugStore.Email,
                        PhoneNumber: newDrugStore.PhoneNumber,
                        Description: newDrugStore.Description,
                        OwnerFullName: newDrugStore.OwnerFullName
                    })
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
                        setSuccess(true);
                        enqueueSnackbar("ثبت با موفقیت انجام شد", { variant: 'success' });
                    }
                    else {
                        setSuccess(false);
                        enqueueSnackbar(`خطایی در ثبت رخ داده است.\r\n ${serverData ? serverData.Message : 'خطای ناشناخته'}`, { variant: 'error' });
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
    const loadUsers = async function (cancellationToken) {
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/account`,
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
                        setUsers(serverData.Data);
                    }
                    else {
                        enqueueSnackbar("خطا در دریافت اطلاعات کاربران. لطفا صفحه را مجددا بارگذاری نمایید", {variant:'warning'});
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

    const ownerSelection = users && !manualOwnerEntry ? (<Grid container alignItems="center">
        <Grid item xs={10}>
            <FormControl fullWidth style={{ margin: '20px' }}>
                <InputLabel id="owner-label">مالک</InputLabel>
                <Select
                    dir="rtl"
                    labelId="owner-label"
                    id="owner"
                    value={newDrugStore.ApplicationUserId || ''}
                    onChange={(event) => {
                        setNewDrugStore(newDrugStore => ({ ...newDrugStore, ApplicationUserId: event.target.value }));
                    }}

                >
                    {Array.from(users).map((item, index) => (
                        (<MenuItem value={item.Id} id={item.Id}>{`${item.FullName} - ${item.PhoneNumber}`}</MenuItem>)))}
                </Select>

            </FormControl>
        </Grid>
        <Grid item xs={2}>
            <IconButton aria-label="edit-owner" color="primary" onClick={() => {
                setManualOwnerEntry(true);
                setNewDrugStore(newDrugStore => ({ ...newDrugStore, ApplicationUserId: '' }));
            }}>
                <Edit />
            </IconButton>
        </Grid>
    </Grid>) : !manualOwnerEntry ? (
        <FormControl fullWidth>
            <TextField style={{ margin: '20px' }}
                dir="rtl"
                id="ownerFullName"
                type='text'
                label="نام و نام خانوداگی مالک"
                value={newDrugStore.OwnerFullName || ''}
                onChange={(event) => {
                    let eventTarget = event.currentTarget;
                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, OwnerFullName: eventTarget.value }))
                }}

            />
        </FormControl>) : '';
    const manualOwnerView = manualOwnerEntry ? (
        <Grid container alignItems="center">
            <Grid item xs={10}>
                <FormControl fullWidth>
                    <TextField style={{ margin: '20px' }}
                        dir="rtl"
                        id="ownerFullName"
                        type='text'
                        label="نام و نام خانوداگی مالک"
                        value={newDrugStore.OwnerFullName || ''}
                        onChange={(event) => {
                            let eventTarget = event.currentTarget;
                            setNewDrugStore(newDrugStore => ({ ...newDrugStore, OwnerFullName: eventTarget.value }))
                        }}

                    />
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <IconButton aria-label="select-owner" color="secondary" onClick={() => {
                    setManualOwnerEntry(false);
                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, OwnerFullName: '' }));
                }}>
                    <Clear />
                </IconButton>
            </Grid>
        </Grid>) : '';
    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }
    if (success) {
        return (<Redirect to='/drugstore/all' />);
    }
    return (
        <div className={classes.root}>
            <Container className="h-100" >
                <Grid container style={{ marginTop: '30px' }}>
                    <Grid item xs={12}>
                        <Typography component="h3">
                            ثبت داروخانه جدید
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="name"
                                type='text'
                                label="نام"
                                value={newDrugStore.Name || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, Name: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="address"
                                type='text'
                                label="آدرس"
                                value={newDrugStore.Address || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, Address: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="email"
                                type='text'
                                label="ایمیل"
                                value={newDrugStore.Email || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, Email: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="phone"
                                type='text'
                                label="شماره تلفن"
                                value={newDrugStore.PhoneNumber || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, PhoneNumber: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="description"
                                type='text'
                                label="توضیحات"
                                value={newDrugStore.Description || ''}
                                multiline={true}
                                rows={4}
                                rowsMax={4}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setNewDrugStore(newDrugStore => ({ ...newDrugStore, Description: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {ownerSelection ? ownerSelection : manualOwnerView}
                    </Grid>
                    <Grid container direction="row" xs={12} justify="flex-end" spacing={2}>
                        <Grid item>
                            <Button color="primary" variant="contained" onClick={submitNewDrugStore}>ثبت</Button>
                        </Grid>
                        <Grid item>
                            <Button color="secondary" variant="outlined" component={Link} to="/drugstore/all">لغو</Button>
                        </Grid>

                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}