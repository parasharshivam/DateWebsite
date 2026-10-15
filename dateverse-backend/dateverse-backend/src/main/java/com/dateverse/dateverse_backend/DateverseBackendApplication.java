package com.dateverse.dateverse_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.dateverse")
@EntityScan(basePackages = "com.dateverse.entity")
@EnableJpaRepositories(basePackages = "com.dateverse.repository")
public class DateverseBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(
				DateverseBackendApplication.class, args);
	}
}