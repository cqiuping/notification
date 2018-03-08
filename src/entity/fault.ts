export interface Fault {
  name?:string;
  createTime?:Date;
  continueTime?:Date;
  recvUserName?:string;
  recvTime?:Date;
  handleTime?:Date;
  resumeTime?:Date;
  typeName?:string;
  level?:number;
  influenceCustomer?:string;
  faultDesc?:string;
}
