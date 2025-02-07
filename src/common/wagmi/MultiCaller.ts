import { ContractStruct, LaunchPadInterface } from './launch-pad-interface';

export default class MultiCaller extends LaunchPadInterface {
    constructor(contractStruct: ContractStruct) {
        super(contractStruct);
    }
}
