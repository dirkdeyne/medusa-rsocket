package io.getmedusa.medusa;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.util.MimeTypeUtils;
import reactor.util.retry.Retry;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;

@Configuration
public class ClientConfiguration {

    @Value("ws://localhost:${spring.rsocket.server.port}${spring.rsocket.server.mapping-path}")
    private String uri;

    @Bean
    public RSocketRequester getRSocketRequester() throws URISyntaxException {
        return RSocketRequester.builder()
                .rsocketConnector(
                        rSocketConnector ->
                                rSocketConnector.reconnect(
                                        Retry.fixedDelay(2, Duration.ofSeconds(2))
                                )
                )
                .dataMimeType(MimeTypeUtils.APPLICATION_JSON)
                .websocket(new URI(uri));
    }
}
