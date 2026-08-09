package com.zohaib.taskmanager.exception;


@SuppressWarnings("serial")
public class InvalidCredentialsException extends RuntimeException {

     public InvalidCredentialsException(String message) {
        super(message);//call the constructor of the parent class, which is RuntimeException.
    }
}
