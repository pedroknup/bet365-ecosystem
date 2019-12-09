import * as React from 'react';

import { RouteComponentProps } from 'react-router';
// import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import './styles.scss';
// import  } from '../containers';
import { LoginSignInForm } from './login-signin-form';
import { LoginSignUpForm } from './login-signup-form';
import { LoginForgotPassword } from './login-forgot-password';
import { authThunk } from 'app/middleware/auth.thunk';
import { LoginContainerProps } from '../containers/login.container';

export interface ILoginComponentProps {}

const useStyles = makeStyles({
  card: {
    minWidth: 275,
    marginTop: 100,
    width: '100%',
    maxWidth: '400px',
    margin: 'auto'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  textField: {
    margin: '8px 0'
  },
  title: {
    margin: '24px auto'
  },
  pos: {
    marginBottom: 12
  }
});

enum loginState {
  signin,
  signup,
  forgot
}
export const LoginComponent = (
  // props: ILoginComponentProps & RouteComponentProps & LoginContainerProps
  props: ILoginComponentProps & RouteComponentProps
) => {
  const [currentLoginState, setCurrentLoginState] = React.useState(loginState.signin);
  const [isLoading, setIsLoading] = React.useState(false);
  const classes = useStyles();
  return (
    <div className="container">
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          {currentLoginState === loginState.signin ? (
            <LoginSignInForm
              isLoading={isLoading}
              onLogin={(email, password) => {
                setIsLoading(true);
                authThunk({ email, password });
                setTimeout(() => {
                  setIsLoading(false);
                }, 1000);
              }}
              onForgotClick={() => {
                setCurrentLoginState(loginState.forgot);
              }}
              onSignUpClick={() => {
                setCurrentLoginState(loginState.signup);
              }}
            />
          ) : currentLoginState === loginState.signup ? (
            <LoginSignUpForm
              onSignInClick={() => {
                setCurrentLoginState(loginState.signin);
              }}
            />
          ) : (
            <LoginForgotPassword
              onBackClick={() => {
                setCurrentLoginState(loginState.signin);
              }}
            />
          )}
        </CardContent>
        <CardActions />
      </Card>
    </div>
  );
};
