import React from 'react';
import './App.css';
import './Assets/Css/netdrug.css';
import { BrowserRouter, Route, Switch, Link as RouterLink, Redirect } from 'react-router-dom';
import Login from './Views/Login.js';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { RTL } from './Components/RTL.js';
import { makeStyles } from '@material-ui/core/styles';
import TopMenu from './Views/TopMenu';
import { SnackbarProvider } from 'notistack';
import Home from './Views/Home';
import DrugStoresIndex from './Views/DrugStore/DrugStoresIndex';
import NewDrugStore from './Views/DrugStore/NewDrugStore';
import EditDrugStore from './Views/DrugStore/EditDrugStore';
import Dashboard from './Views/Dashboard/Dashboard';
import AuthHandler from './Components/AuthHandler';
import OrderDetails from './Views/Order/OrderDetails';
import VirtualizedListTest from './Views/VirtualizedListTest';
import TableTest from './Views/TableTest';
import PackagePrepare from './Views/Order/PackagePrepare';
import OrdersWaitingCustomerConfirmation from './Views/Order/OrdersWaitingCustomerConfirmation';
import GradientBtn from './Components/GradientButton/GradientButton';
import OrdersReadyToDelivery from './Views/Order/OrdersReadyToDelivery';


const theme = createMuiTheme({
  direction: 'rtl',
});
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
            <div className="App">
              <body>
                <BrowserRouter>
                  <TopMenu />
                <Switch>
                <Route path='/test' component={GradientBtn} />
                  <Route path='/orders/waitingforcustomer' component={OrdersWaitingCustomerConfirmation} />
                  <Route path='/orders/readytodelivery' component={OrdersReadyToDelivery} />
                  <Route path='/orders/:orderId/prepare' component={PackagePrepare} />
                  <Route path='/orders/:orderId/details' component={OrderDetails} />
                  
                    <Route path='/dashboard' component={Dashboard} />
                    <Route path='/login' component={Login} />
                    <Route path='/drugstore/all' component={DrugStoresIndex} />
                    <Route path='/drugstore/new' component={NewDrugStore} />
                    <Route path='/drugstore/edit/:drugStoreId' component={EditDrugStore} />
                    
                    <Route path='/' component={Dashboard} />


                  </Switch>
                </BrowserRouter>
              </body>
            </div>
        </SnackbarProvider>
      </ThemeProvider>
    </RTL>
  );
}

export default App;
