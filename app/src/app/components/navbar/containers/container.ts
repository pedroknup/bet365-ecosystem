import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

// import { IAppState } from '@app/stores';

import * as sessionActions from '../../../store/sessions/actions';
import * as betActions from '../../../store/todos/actions';
import { ILoginPayload } from '../../../store/sessions/types';

import { IApplicationState } from 'app/store';
import { Dispatch, Action, AnyAction } from 'redux';
import { withRouter } from 'react-router-dom';
import { user } from '../../../../../../api/src/entities/user';
import { INavbarComponentProps } from '../components';
import { NavbarComponent } from '../components';

interface IStateProps {
  isLoading?: boolean;
  loggedUser?: user;
}
interface IDispatchProps {}

const mapStateToProps: MapStateToProps<IStateProps, INavbarComponentProps, IApplicationState> = ({
  session,
  todo
}) => ({ isLoading: todo.isLoading, loggedUser: session.user });
// const mapStateToProps = ({ session }: IApplicationState) => ({
//   loading: heroes.loading,
//   errors: heroes.errors,
//   data: heroes.data
// });

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, INavbarComponentProps> = (
  dispatch
) => ({
  // login: (payload) => {
  //   console.log(payload);
  //   return dispatch(sessionActions.loginAction(payload));
  // },
  // fetchBets: (token) => {
  //   return dispatch(betActions.fetchBetAction(token));
  // }
});

// export interface NavbarContainerPropsProps=  IDispatchProps & IStateProps;

export type NavbarContainerProps = IStateProps & IDispatchProps;
// const mapDispatchToProps = (dispatch: Dispatch<IDispatchProps>) => ({
//   login: (payload: ILoginPayload) => dispatch(sessionActions.loginAction(payload))
// });

export const NavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavbarComponent));
