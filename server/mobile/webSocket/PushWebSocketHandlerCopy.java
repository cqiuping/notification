/*   
 * Copyright (c) 2018年01月05日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.webSocket;

import com.xuanwu.ams.common.entity.SysEvent.EventType;
import com.xuanwu.ams.sdk.util.JsonUtil;
import com.xuanwu.ams.services.msg.MsgItem;
import com.xuanwu.ams.services.msg.MsgLevel;
import com.xuanwu.ams.services.msg.MsgType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/1/5
 */
public class PushWebSocketHandlerCopy extends TextWebSocketHandler {
    private static Logger logger = LoggerFactory.getLogger(TextWebSocketHandler.class);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        session.sendMessage(new TextMessage("server connected"));
        logger.info("pushWebSocketHandlerCopy connected");
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message)
            throws Exception {
        MsgItem msgItem = new MsgItem(MsgType.MOBILE,
                new MsgLevel(EventType.THOLD_ALARM,2), "阈值告警",
                5);
        PushWebSocketHandler.sendMessage(new TextMessage(JsonUtil.toJson(msgItem)));
    }

}
