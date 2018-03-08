export interface FaultOrder {
   eventIds:number[];//批量处理的eventId

   eventId:number; //事件ID，一一对应

   name:string; //故障名

   level:number;// 故障等级

   typeName:string;

   state:number;

   continueTime:number;

   alertUpgrade:boolean;

   createTime:Date;// 创建时间

   recvTime:Date;// 认领时间

   recvUser:number;

   recvUserName:string;

   handleTime:Date;// 处理时间

   resumeTime:Date;// 恢复时间

   influenceCustomer:string;// 受影响客服

   faultDesc:string;// 描述

   solveDesc:string;// 解决方案描述

   startTime:Date;//查询条件-开始时间

   endTime:Date;//查询条件-结束时间

   eventLevel:number;

   actionTime:number;//响应时间

   nodeId:number;

   nodeName:string;

   nodeType:number;

   enterpriseId:number;

   appId:number;

   eventType:number;

   hostId:number;//部署的服务器id
   hostName:number;//部署的服务器

   handleDescribe:string;

   sourceId:number;

   autoHandle:boolean;

   channelInfoId:number;//通道ID 用于通道切换
}