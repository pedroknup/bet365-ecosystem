import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
// import { IAppState } from '@app/stores';

import * as sessionActions from '../../../store/sessions/actions';
import * as betActions from '../../../store/todos/actions';
import * as navActions from '../../../store/navigation/actions';
import { ILoginPayload } from '../../../store/sessions/types';

import { IApplicationState } from 'app/store';
import { Dispatch, Action, AnyAction } from 'redux';
import { ISidebarComponentProps } from '..';
import { SidebarComponent } from '../components/side-bar';
import { withRouter } from 'react-router-dom';
import { user } from '../../../../../../api/src/entities/user';

interface IStateProps {
  isExpanded?: boolean;
  isOpened?: boolean;
}
interface IDispatchProps {
  toggleSidebarExpanded?: () => void;
  toggleSidebarOpened?: () => void;
}

const mapStateToProps: MapStateToProps<IStateProps, ISidebarComponentProps, IApplicationState> = (
  state
) => {
  const { isExpanded, isOpened } = state.navigation;

  return {
    isExpanded: isExpanded ? isExpanded : false,
    isOpened: isOpened ? isOpened :  false
  };
};

const mapDispatchToProps: MapDispatchToProps<IDispatchProps, ISidebarComponentProps> = (
  dispatch
) => {
  return {
    toggleSidebarExpanded: () => dispatch(navActions.toggleExpanded),
    toggleSidebarOpened: () => dispatch(navActions.toggleOpened)
  };
};

// export type SidebarContainerProps = IStateProps & IDispatchProps;
export type SidebarContainerProps = IStateProps & IDispatchProps;

export const SidebarContainer = connect<IStateProps>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SidebarComponent));
// )(SidebarComponent);
