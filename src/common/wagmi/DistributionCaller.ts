import { ContractInfo } from './launch-pad-interface';
import { DistributionInterface } from './distribution-interface';

export default class DistributionCaller extends DistributionInterface {
  constructor(contractInfo: ContractInfo) {
    super(contractInfo);
  }
}
