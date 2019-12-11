import { bet } from '../../../../../api/src/entities/bet';


export interface IBetState {
  isLoading: boolean;
  bets?: bet[]
}

