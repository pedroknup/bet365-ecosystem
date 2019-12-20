import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

// import { IAppState } from '@app/stores';

import * as sessionActions from '../../../store/sessions/actions';
import * as betActions from '../../../store/todos/actions';
import { ILoginPayload } from '../../../store/sessions/types';

import { IApplicationState } from 'app/store';
import { Dispatch, Action, AnyAction } from 'redux';
import { ISidebarComponentProps } from '..';
import { SidebarComponent, INavButton } from '../components/side-bar';
import { withRouter } from 'react-router-dom';

interface IStateProps {
  isLoading?: boolean;
}
interface IDispatchProps {}

const mapStateToProps: MapStateToProps<IStateProps, ISidebarComponentProps, IApplicationState> = ({
  session,
  todo
}) => ({ isLoading: todo.isLoading });
// const mapStateToProps = ({ session }: IApplicationState) => ({
//   loading: heroes.loading,
//   errors: heroes.errors,
//   data: heroes.data
// });

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, ISidebarComponentProps> = (
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

// export interface SidebarContainerPropsProps=  IDispatchProps & IStateProps;

export type SidebarContainerProps = IStateProps & IDispatchProps;
// const mapDispatchToProps = (dispatch: Dispatch<IDispatchProps>) => ({
//   login: (payload: ILoginPayload) => dispatch(sessionActions.loginAction(payload))
// });

export const SidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SidebarComponent));
