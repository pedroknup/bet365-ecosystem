import * as React from 'react';
import './styles.scss';

interface IHeadBarComponentProps {
  user?: string;
}
export const HeadBarComponent = (props:  IHeadBarComponentProps) => {

  return (
    <div className="head-bar">
      <div>
        {props.user}
      </div>
    </div>
  );
};
