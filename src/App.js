import React, { useState, useEffect } from 'react';
import './App.css';
import './Assets/Css/netdrug.css';
import { BrowserRouter, Route, Switch, Link as RouterLink, Redirect, Router } from 'react-router-dom';
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
import CustomDrugsIndex from './Views/CustomDrug/CustomDrugsIndex';
import CustomDrugDetails from './Views/CustomDrug/CustomDrugDetails';
import CustomDrugEdit from './Views/CustomDrug/CustomDrugEdit';
import { responseHandler } from './Helpers/ResponseHandler';
import { history } from './Helpers/History';
import CustomDrugNew from './Views/CustomDrug/CustomDrugNew';
import { authenticationService } from './Services/AuthenticationService';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
  useEffect(() => {
    responseHandler.userNotAuthorized.subscribe(notAuthorized => {
      if (notAuthorized) {
        setIsNotAuthorized(true);
      }
    });
   
  }, []);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  if (isNotAuthorized) {
    
    history.push('/login');
  }
  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}>
          <div className="App">
            <body>
              <Router history={history} >
                <TopMenu userRoles={authenticationService.currentUserValue && authenticationService.currentUserValue.roles} />
                <Switch>
                  <Route path='/customdrug/new' component={CustomDrugNew} />
                  <Route path='/customdrug/:customDrugId/details' component={CustomDrugDetails} />
                  <Route path='/customdrug/:customDrugId/edit' component={CustomDrugEdit} />
                  <Route path='/orders/waitingforcustomer' component={OrdersWaitingCustomerConfirmation} />
                  <Route path='/orders/readytodelivery' component={OrdersReadyToDelivery} />
                  <Route path='/orders/:orderId/prepare' component={PackagePrepare} />
                  <Route path='/orders/:orderId/details' component={OrderDetails} />

                  <Route path='/dashboard' component={Dashboard} />
                  <Route path='/login' component={Login} />
                  <Route path='/drugstore/all' component={DrugStoresIndex} />
                  <Route path='/drugstore/new' component={NewDrugStore} />
                  <Route path='/drugstore/edit/:drugStoreId' component={EditDrugStore} />
                  <Route path='/customdrug/all' component={CustomDrugsIndex} />

                  <Route path='/' component={Dashboard} />


                </Switch>
              </Router>
            </body>
          </div>
        </SnackbarProvider>
      </ThemeProvider>
    </RTL>
  );
}

export default App;
