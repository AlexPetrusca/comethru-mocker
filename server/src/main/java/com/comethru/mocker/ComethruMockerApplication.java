package com.comethru.mocker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ComethruMockerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComethruMockerApplication.class, args);
	}

}
