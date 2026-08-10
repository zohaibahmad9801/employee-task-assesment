package com.zohaib.taskmanager.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.zohaib.taskmanager.entity.Role;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Autowired
    private CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException("User not found");
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http.cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public endpoints
                        .requestMatchers(
                                "/api/auth/login",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html")
                        .permitAll()

                        // Register API
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/register")
                        .hasRole(Role.ADMIN.toString())

                        // Employee APIs
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/employees")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/employees/**")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/employees/**")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/employees/**")
                        .hasRole(Role.ADMIN.toString())
                        
                     // Task APIs (EMPLOYEE)
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tasks/*/status")
                        .hasRole(Role.EMPLOYEE.toString())
                        
                        
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tasks/my-tasks")
                        .hasRole(Role.EMPLOYEE.toString())

                        // Task APIs (Admin)
                        
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tasks/**")
                        .hasRole(Role.ADMIN.toString())
                        
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/tasks")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/tasks")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tasks/**")
                        .hasRole(Role.ADMIN.toString())

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/tasks/**")
                        .hasRole(Role.ADMIN.toString())

                        // All other APIs require authentication
                        .anyRequest().authenticated())

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        configuration.setAllowedOrigins(origins);

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(
                List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }
}