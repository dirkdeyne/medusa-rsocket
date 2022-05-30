package io.getmedusa.medusa.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Mono;

@Controller
public class MessageController {

    @MessageMapping("/message")
    public Mono<String> hello(@Payload Mono<String> who){
        return Mono.zip(
                Mono.just("Hello") , who,
                (s, s2) -> new StringBuilder(s).append(" ").append(s2).append("!").toString() );
    }
}
