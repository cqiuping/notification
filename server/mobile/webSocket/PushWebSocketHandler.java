/*   
 * Copyright (c) 2018年01月04日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.websocket;

import com.xuanwu.ams.services.msg.SendResult;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;


/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/1/4
 */
public class PushWebSocketHandler extends TextWebSocketHandler {

    private static Logger logger = LoggerFactory.getLogger(PushWebSocketHandler.class);
    private static final CopyOnWriteArraySet<WebSocketSession> webSocketSessionSet = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        webSocketSessionSet.add(session);
        logger.info("connection established and the send result is:{}", session);
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message)
            throws Exception {
        logger.info("receive message:{}", message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
            throws Exception {
        super.afterConnectionClosed(session, status);
        webSocketSessionSet.remove(session);
        logger.info("a connection closed:{}", session);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception)
            throws Exception {
        super.handleTransportError(session, exception);
        logger.error("websocket transport error:{}", exception.getMessage());
    }

    /**
     * 群发消息,当出现告警时调用
     */
    public static SendResult sendMessage(WebSocketMessage message) {
        int count = 0;
        logger.info("webSocketSessionSet's size:{}", webSocketSessionSet.size());
        for (WebSocketSession session : webSocketSessionSet) {
            try {
                session.sendMessage(message);
            } catch (IOException e) {
                logger.error(e.getMessage());
                count++;
                continue;
            }
        }
        return count > 0 ? SendResult.buildFailre() : SendResult.buildSuccess();
    }

}
