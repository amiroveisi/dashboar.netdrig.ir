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
    const { enqueueSnackbar } = useSnackbar();
    const netDrugStyles = useNetDrugStyles();
    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/oauth2/token`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'Username=' + username + '&Password=' + password + '&grant_type=password'

                });
            if (!response) {
                setIsLoading(false);
                enqueueSnackbar(`خطایی رخ داده است. ${response.status} ${response.statusText}`, { variant: 'error' });
            }
            else {
                try {
                    const data = await response.json();
                    if (data && data.access_token) {
                        AuthHelper.LoggedIn(data.access_token);
                        setIsLoading(false);
                        setIsLoggedIn(true);
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

        } catch (error) {
            console.log(error);
            if (error == 'TypeError: Failed to fetch') {
                setIsLoading(false);
                enqueueSnackbar('خطا در برقراری ارتباط با سرور. لطفا ارتباط اینترنتی خود را بررسی کنید', { variant: 'error' });
            }
        }
    }
   
    if (isLoggedIn) {
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
                            <Button className={netDrugStyles.gradientButtonPrimary} fullWidth variant="contained" disabled={isLoading} color="primary" startIcon={<KeyIcon />} onClick={handleLogin}>
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
