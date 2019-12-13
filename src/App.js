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
              {/* <BrowserRouter>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route path='/login' component={Login} />
                  <Route path='/drug/details/:drugId' component={DrugDetails} />
                </Switch></BrowserRouter> */}
              <BrowserRouter>
                <TopMenu/>
                <Switch>
                  <Route path='/login' component={Login} />
                  <Route path='/drugstore/all' component={DrugStoresIndex} />
                  <Route path='/' component={Home} />
                  
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
