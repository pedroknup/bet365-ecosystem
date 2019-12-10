import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
// import { App as TodoApp } from 'app/containers/App';
import { hot } from 'react-hot-loader';
import { LoginComponent } from '../components/pages/login';
import { LoginContainer } from '../components/pages/login/containers/login.container';
import { SidebarComponent } from 'app/components/shared/sidebar';
import { HomeContainer } from '../components/pages/home/containers/container';

export const PrivateRoutes = hot(module)(() => (
  <div>
    <SidebarComponent />
    <div>
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Redirect exact from="/login" to="/" />
      </Switch>
    </div>
  </div>
));
