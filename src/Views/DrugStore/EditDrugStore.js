import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Link as RouterLink } from 'react-router-dom';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { useSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';

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
export default function EditDrugStore(props) {
    const classes = useStyles();
    const [drugStore, setDrugStore] = useState(null);
    const [success, setSuccess] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);
    const [loadError, setLoadError] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        const drugStoreId = props.match.params.drugStoreId;
        console.log(drugStoreId);
        loadDrugStore(drugStoreId, abortSignal);
        //useEffect's cleanup
        return () => { abortController.abort() };

    }, []);
    const submitNewDrugStore = async function () {
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/drugstore`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthHelper.GetAuthToken()}`
                    },
                    body: JSON.stringify({
                        Name: drugStore.Name,
                        Address: drugStore.Address,
                        Email: drugStore.Email,
                        PhoneNumber: drugStore.PhoneNumber,
                        Description: drugStore.Description,
                        OwnerFullName: drugStore.OwnerFullName,
                        Id: drugStore.Id,
                        ApplicationUserId: drugStore.ApplicationUserId
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
                        enqueueSnackbar("ویرایش با موفقیت انجام شد", { variant: 'success' });
                    }
                    else {
                        setSuccess(false);
                        enqueueSnackbar(`خطایی در ویرایش رخ داده است.\r\n ${serverData ? serverData.Message : 'خطای ناشناخته'}`, { variant: 'error' });
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
    const loadDrugStore = async function (drugStoreId, cancellationToken) {
        try {
            if (!drugStoreId) {
                setLoadError('not found');
                return;
            }
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/drugstore/${drugStoreId}`,
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
                        setDrugStore(serverData.Data);
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
    if (success) {
        return (<Redirect to='/drugstore/all' />);
    }
    if (!drugStore) {
        return (
            <div className={classes.root}>
                <Container className="h-100" >
                    <Grid container style={{ marginTop: '30px' }}>
                        <Grid item xs={12} style={{marginBottom:'30px'}}>
                            <Typography component="h3">
                                ویرایش داروخانه
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="text" width={'80%'} height={30} style={{ marginTop: '30px' }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="text" width={'80%'} height={30} style={{ marginTop: '30px' }}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="text" width={'80%'} height={30} style={{ marginTop: '30px' }}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="text" width={'80%'} height={30} style={{ marginTop: '30px' }}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Skeleton variant="text" width={'80%'} height={30} style={{ marginTop: '30px' }}/>
                        </Grid>

                    </Grid>
                </Container>
            </div>
        );
    }
    return (
        <div className={classes.root}>
            <Container className="h-100" >
                <Grid container style={{ marginTop: '30px' }}>
                    <Grid item xs={12}>
                        <Typography component="h3">
                            ویرایش داروخانه
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField style={{ margin: '20px' }}
                                dir="rtl"
                                id="name"
                                type='text'
                                label="نام"
                                value={drugStore.Name || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setDrugStore(newDrugStore => ({ ...newDrugStore, Name: eventTarget.value }))
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
                                value={drugStore.Address || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setDrugStore(newDrugStore => ({ ...newDrugStore, Address: eventTarget.value }))
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
                                value={drugStore.Email || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setDrugStore(newDrugStore => ({ ...newDrugStore, Email: eventTarget.value }))
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
                                value={drugStore.PhoneNumber || ''}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setDrugStore(newDrugStore => ({ ...newDrugStore, PhoneNumber: eventTarget.value }))
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
                                value={drugStore.Description || ''}
                                multiline={true}
                                rows={4}
                                rowsMax={4}
                                onChange={(event) => {
                                    let eventTarget = event.currentTarget;
                                    setDrugStore(newDrugStore => ({ ...newDrugStore, Description: eventTarget.value }))
                                }}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>

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