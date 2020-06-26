import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '../Assets/Css/netdrug.css';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import KeyIcon from '@material-ui/icons/VpnKey';
import * as ConstantValues from '../Helpers/ConstantValues';

import { useSnackbar } from 'notistack';
import * as AuthHelper from '../Helpers/AuthHelper';
import useNetDrugStyles from '../Components/Styles';
import * as drugStoreHelper from '../Helpers/DrugStoreHelper';
import { authenticationService } from '../Services/AuthenticationService';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        fontFamily: 'IranSans'
    },
    paper: {
        padding: theme.spacing(2),
        marginTop: '50%',
        color: theme.palette.text.primary,
        verticalAlign: 'center',
        height: '320px !Important'
    },
    loginButton: {
        margin: '20px'
    },
    grid: {
        padding: theme.spacing(2)
    }
}));

export default function Login() {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [drugStoreId, setDrugStoreId] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const netDrugStyles = useNetDrugStyles();
    const getUserDrugStore = async function () {
        try {
            
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/drugstore/userdrugstore`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authenticationService.currentUserValue.token}`
                    }
                });
            if (!response) {
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    const data = await response.json();
                    if (data && data.Data) {
                        setDrugStoreId(data.Data.Id);
                        return data;
                    }
                    else {
                        setDrugStoreId('none');
                    }
                } catch (error) {
                    setDrugStoreId('none');
                    enqueueSnackbar("خطا در دریافت برخی اطلاعات از سرور", { variant: 'error' });
                }
            }
            return false;
        } catch (error) {
            console.log(error);
            setDrugStoreId('none');
            if (error == 'TypeError: Failed to fetch') {
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
            return false;
        }
    };
    const login = async () => {
        setIsLoading(true);
        try {
            const response = await authenticationService.login(username, password);
           
            if (!response) {
                setIsLoading(false);
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    const data = response;//.json();
                    if (data && data.access_token) {
                        AuthHelper.LoggedIn(data.access_token);
                        setIsLoading(false);
                        setIsLoggedIn(true);
                        return true;
                    }
                    else {
                        setIsLoading(false);
                        enqueueSnackbar(" نام کاربری یا کلمه عبور صحیح نمی باشد", { variant: 'error' });
                    }
                } catch (error) {
                    setIsLoading(false);
                    enqueueSnackbar("خطا در دریافت اطلاعات از سرور", { variant: 'error' });
                }
            }

            return false;
        } catch (error) {
            console.log(error);
            if (error == 'TypeError: Failed to fetch') {
                setIsLoading(false);
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
            return false;
        }
    };

    if (isLoggedIn && !drugStoreId) //if is logged in but not tried to get drug store id
    {
        getUserDrugStore();
    }
    if (isLoggedIn && drugStoreId) //if is logged in and have got drug store id (or at least tried to and got nothing!)
    {
        drugStoreHelper.setDrugStoreId(drugStoreId);
        document.location.href = '/';
    }

    return (

        <div className={classes.root}>

            <Container maxWidth="xs" className="h-100" >
                <Paper elevation="5" className={classes.paper}>
                    <Grid className={classes.grid} direction="column" container xs={12} justify="center" alignItems="stretch" >
                        <Grid item >
                            <Typography component="h2">
                                ورود به داشبورد داروخانه - نت دراگ
                        </Typography>
                        </Grid>
                        <Grid item >
                            <FormControl fullWidth>
                                <TextField style={{ marginTop: '20px', marginBottom: '20px' }}
                                    dir="rtl"
                                    id="username"
                                    type='text'
                                    label="نام کاربری"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}

                                />
                                <TextField style={{ marginBottom: '20px' }}
                                    dir="rtl"
                                    id="password"
                                    type='password'
                                    label="کلمه عبور"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}

                                />

                            </FormControl>
                        </Grid>
                        <Grid item alignItems="stretch">
                            <Button className={netDrugStyles.gradientButtonPrimary} fullWidth variant="contained"
                                disabled={isLoading} color="primary" startIcon={<KeyIcon />} onClick={login}>
                                ورود
                                </Button>

                        </Grid>
                        <Grid item alignItems="stretch">
                            <Typography style={{ marginTop: '10px', fontSize: '12px' }}>
                                <Link href="#">کلمه عبور خود را فراموش کرده ام!</Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

        </div>

    );

}
