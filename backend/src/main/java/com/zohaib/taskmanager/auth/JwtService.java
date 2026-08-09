package com.zohaib.taskmanager.auth;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.zohaib.taskmanager.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;
    
    /* This method used to generate signing key used to sign the token*/
    private Key getSigningKey() {
    	//get the secret from yaml
        // convert it into bytes 
    	//hmacShaKeyFor: This converts the byte array into a Key(crypto graphic key) object that JWT can use.
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /*This methods creates the JWT token that is sent to the user after login*/
    public String generateToken(User user) {

        return Jwts.builder() //creates JWT builder
                .setSubject(user.getEmail()) // set the subject(user Identity) now token has email
                .claim("role", user.getRole().name()) // add role as claim(extra info) now token has role as well
                .setIssuedAt(new Date())//  set the token creation time
                .setExpiration(new Date(System.currentTimeMillis() + expiration))// set the token expiration time
                .signWith(getSigningKey())// sign the token with secret key
                .compact();// convert JWT object to String
    }
    
    
    private Claims extractAllClaims(String token) {
    	
    	return Jwts.parserBuilder() // This creates a JWT parser.
    		   .setSigningKey(getSigningKey())// The parser needs the secret key to verify whether the token is genuine.
    		   .build()// Parser is ready to read the token
    		   .parseClaimsJws(token)// decodes token and extract only extract claims(token has: headers,payload,signature)
    		   .getBody();// returns payload/claims
    		   
    	
    }
    
    
    public String extractUsername(String token) {
          	return extractAllClaims(token).getSubject();// from payload extract subject/email/username
    }

}