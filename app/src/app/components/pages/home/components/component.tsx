import * as React from 'react';

import { RouteComponentProps } from 'react-router';
// import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import './styles.scss';
// import  } from '../containers';
import { authThunk } from 'app/middleware/auth.thunk';
import { HomeContainerProps } from '../containers';

import { todo } from '../../../../../../../api/src/entities/todo';


export interface IHomeComponentProps extends HomeContainerProps {}

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
export const HomeComponent = (
  // props: IHomeComponentProps & RouteComponentProps & HomeContainerProps
  props: IHomeComponentProps & HomeContainerProps
) => {
  const [currentLoginState, setCurrentLoginState] = React.useState(loginState.signin);
  const { isLoading, password, email, token, errorMsg, history } = props;
  const [selectedBet, onSelectTodo] = React.useState<todo | undefined>(undefined);
  const classes = useStyles();
  if (!token) {
    history.push('/login');
    return <div>Redirect</div>;
  }

  return (
    <div className="home-container">
      {selectedBet && (
        <Card>
          <CardContent>
            {/* <BetInfo todo={selectedBet} /> */}
          </CardContent>
        </Card>
      )}
      <span style={{ maxWidth: 200, whiteSpace: 'normal', overflow: 'scroll', display: 'block' }}>
        HOME Token: {token}
      </span>
      {props.todos && props.todos.length}
      {/* <EnhancedTable
        onSelectTodo={(todo:any) => onSelectTodo(todo)}
        rows={props.todos ? props.todos : []}
        title={'Bets'}
      /> */}

      <button
        onClick={() => {
          props.fetchTodos(token);
        }}
      >
        Fetch
      </button>
    </div>
  );
};
