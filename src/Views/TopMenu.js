import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import * as AuthHelper from '../Helpers/AuthHelper';


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
    const handleLoginButtonClick = () => {
        if (AuthHelper.IsLoggedIn()) {
            AuthHelper.LogOff();
            document.location.href = '/';
        }
        else
        {
            document.location.href = '/login';
        }
    }
    return (
        <AppBar position="static">
            <Toolbar>
                {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton> */}
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