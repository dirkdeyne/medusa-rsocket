package io.getmedusa.medusa.controller;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class Sender {

    private final RSocketRequester requester;

    public Sender(RSocketRequester requester) {
        this.requester = requester;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void hello(){
        requester.route("/message").data(Mono.just("World")).retrieveMono(String.class).subscribe(System.out::println);
    }

}
