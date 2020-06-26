import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

// import { IAppState } from '@app/stores';

import * as sessionActions from '../../../store/sessions/actions';
import * as betActions from '../../../store/bets/actions';
import { ILoginPayload } from '../../../store/sessions/types';


import { RouteComponentProps } from 'react-router';
import { IApplicationState } from 'app/store';
import { Dispatch, Action, AnyAction } from 'redux';
import { bet } from '../../../../../../main/src/entities/bet';
import { ISidebarComponentProps } from '..';
import { SidebarComponent, INavButton } from '../components/side-bar';

interface IStateProps {

}
interface IDispatchProps {
  
}

const mapStateToProps: MapStateToProps<IStateProps, ISidebarComponentProps, IApplicationState> = ({
  session,
  bet
}) => ({

});
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

export type SidebarContainerProps = IStateProps & IDispatchProps & RouteComponentProps;
// const mapDispatchToProps = (dispatch: Dispatch<IDispatchProps>) => ({
//   login: (payload: ILoginPayload) => dispatch(sessionActions.loginAction(payload))
// });

export const SidebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarComponent);
