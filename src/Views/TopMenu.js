import React, { useState, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import * as AuthHelper from '../Helpers/AuthHelper';
import { Grid } from '@material-ui/core';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
}));

const Link = React.forwardRef((props, ref) => (
    <RouterLink innerRef={ref} {...props} />
));

export default function TopMenu() {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState(null);
    const handleLoginButtonClick = () => {
        if (AuthHelper.IsLoggedIn()) {
            AuthHelper.LogOff();
            document.location.href = '/';
        }
        else {
            document.location.href = '/login';
        }
    }
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;

        AuthHelper.GetUserInfo(abortSignal).then(result => {
           
            setUserInfo(result);
        });
        //useEffect's cleanup
        return () => { abortController.abort() };
    },[])
    return (
        <AppBar position="static">
            <Toolbar>
                {userInfo && userInfo !== 'error' && <React.Fragment>
                    <AccountCircleRoundedIcon style={{ color: 'white' }} />
                    <Button className={classes.menuButton} color="inherit" component={Link} to="/profile">
                        {userInfo && `${userInfo.FullName ? userInfo.FullName : userInfo.UserName}  خوش آمدید!` || ''}
                    </Button></React.Fragment>}
                <Button className={classes.menuButton} color="inherit" component={Link} to="/">
                    صفحه اصلی
                </Button>
                <Button className={classes.menuButton} color="inherit" component={Link} to="/drugstore/all">
                    مدیریت داروخانه ها
                </Button>

                <Button className={classes.menuButton} color="inherit" component={Link} to={AuthHelper.IsLoggedIn() ? '/' : '/login'}
                    onClick={() => {
                        handleLoginButtonClick();
                    }}>
                    {AuthHelper.IsLoggedIn() ? "خروج" : "ورود"}
                </Button>



            </Toolbar>

        </AppBar>
    );
}