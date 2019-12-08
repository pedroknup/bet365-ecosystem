// import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';

// // import { IAppState } from '@app/stores';

// // import { settingsActions, ISettings } from '@app/stores/settings';
// import { ILoginComponentProps, LoginComponent } from '../components';
// import { RouteComponentProps } from 'react-router';

// interface IStateProps {}
// interface IDispatchProps {
//   // setSettings: (settings: ISettings) => void;
 
// }

// // const mapStateToProps: MapStateToProps<IStateProps, ILoginComponentProps, IAppState> = (state) => {
// const mapStateToProps: MapStateToProps<IStateProps, ILoginComponentProps, RouteComponentProps> = (
//   state
// ) => {
//   // const { token, countRecords, name } = state.settings;

//   // return { token, countRecords, name };
//   return {};
// };

// const mapDispatchToProps: MapDispatchToProps<IDispatchProps, ILoginComponentProps> = (
//   dispatch
// ) => ({
//   // setSettings: (settings: ISettings) => dispatch(settingsActions.setSettings(settings))
// });

// export type LoginContainerProps = IStateProps & IDispatchProps & RouteComponentProps;
// export const LoginContainer = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(LoginComponent);
