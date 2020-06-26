import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
// import { App as TodoApp } from 'app/containers/App';
import { hot } from 'react-hot-loader';
import { LoginComponent } from '../components/pages/login';
import { LoginContainer } from '../components/pages/login/containers/login.container';
import { SidebarComponent } from 'app/components/shared/sidebar';
import { HomeContainer } from '../components/pages/home/containers/container';
import { SidebarContainer } from 'app/components/sidebar';

export const PrivateRoutes = hot(module)(() => (
  <div
    style={{
      backgroundColor: '#f0f0f0',
      display: 'flex',
      flexDirection: 'row',
      marginLeft: -8,
      overflow: 'scroll',
      marginTop: -8
    }}
  >
    <SidebarContainer/>
    <div style={{ flex: 1 }}>
      <NavbarContainer />
      <div style={{ padding: 16, flex: 1 }}>
        <Switch>
          <Route exact path="/" component={HomeContainer} />
          <Redirect exact from="/login" to="/" />
        </Switch>
      </div>
    </div>
  </div>
));
