import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Grid, Paper, Typography } from '@material-ui/core';
import DrugStoreList from '../../Components/DrugStoreList';
import { useSnackbar } from 'notistack';
import * as ConstantValues from '../../Helpers/ConstantValues';
import * as AuthHelper from '../../Helpers/AuthHelper';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import { Link as RouterLink } from 'react-router-dom';


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
export default function DrugStoresIndex() {
    const [data, setData] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [dataIsEmpty, setDataIsEmpty] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const noDataView = (<h6>اطلاعاتی برای نمایش وجود ندارد</h6>);
    console.log(AuthHelper.GetAuthToken());
    useEffect(() => {
        const abortController = new AbortController();
        const abortSignal = abortController.signal;
        loadDrugStores(abortSignal);
        //useEffect's cleanup
        return () => { abortController.abort() };
    }, []);

    const loadDrugStores = async function (cancellationToken) {
        try {
            const response = await fetch(`${ConstantValues.WebApiBaseUrl}/api/drugstore`,
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
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
                    if (serverData && serverData.Data) {
                        let viewModel = [];
                        Array.from(serverData.Data).map(item => {
                            viewModel.push({
                                Image: null,
                                Title: item.Name,
                                Address: item.Address,
                                Id : item.Id
                            });
                        });
                        setData(viewModel);
                        setDataIsEmpty(false);
                    }
                    else {
                        setDataIsEmpty(true);

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

    const classes = useStyles();
    if (unauthorized) {
        return (
            <Redirect to="/login" />
        );
    }
    if (dataIsEmpty) {
        return ( <div className={classes.root}>{ noDataView }</div>);
    }
    return (
        <div className={classes.root}>
            <Container className="h-100" >
                <Grid container className={classes.grid} style={{marginTop:'30px'}} direction="column" xs={12} justify="center" alignItems="stretch" >
                <Grid item xs={12}>
                        <Typography component="h3">
                            لیست داروخانه ها
                        </Typography>
                    </Grid>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button color="primary" variant='outlined' startIcon={<Add />} component={Link} to="/drugstore/new">داروخانه جدید</Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <DrugStoreList data={data} />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}