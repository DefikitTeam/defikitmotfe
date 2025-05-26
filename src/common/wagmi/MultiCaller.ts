import { ContractInfo, LaunchPadInterface } from './launch-pad-interface';

export default class MultiCaller extends LaunchPadInterface {
  constructor(contractInfo: ContractInfo) {
    super(contractInfo);
  }
}
