import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Assets/Css/netdrug.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Views/Login.js';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { createMuiTheme,ThemeProvider  } from '@material-ui/core/styles';
import { RTL } from './Components/RTL.js';
const theme = createMuiTheme({
  direction: 'rtl',
});
function App() {
  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <div className="App">
          <header>
            {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
          </header>
          <body>
            <BrowserRouter>
              <Switch>
                {/* <Route exact path='/' component={Home} /> */}
                <Route path='/login' component={Login} />
                {/* <Route path='/drug/list' component={DrugsGrid} />
          <Route path='/drug/new' component={NewDrug} />
          <Route path='/drug/edit/:drugId' render={props => <EditDrug   {...props} CurrentPage={2} />} />
          <Route path='/drug/details/:drugId' component={DrugDetails} />
          <Route path='/medicalproduct/new' component={NewMedicalProduct} />
          <Route path='/medicalproduct/list' component={MedicalProductsGrid} />
          <Route path='/medicalproduct/edit/:productId' component={MedicalProductEdit} /> */}
              </Switch></BrowserRouter>
          </body>
        </div>
      </ThemeProvider>
    </RTL>
  );
}

export default App;
