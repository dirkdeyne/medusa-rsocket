package io.getmedusa.medusa.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class MedusaController {

    @MessageMapping("/")
    public String index(){
        return "index";
    }
}
