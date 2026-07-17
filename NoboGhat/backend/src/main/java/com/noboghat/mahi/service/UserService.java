package com.noboghat.mahi.service;

import org.springframework.stereotype.Service;

import com.noboghat.mahi.dto.UserRegistrationDto;
import com.noboghat.mahi.model.User;
import com.noboghat.mahi.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerNewUser(UserRegistrationDto registrationDto) {
        User newUser = new User();
        newUser.setName(registrationDto.getName());
        newUser.setPhone(registrationDto.getPhone());
        newUser.setRole(registrationDto.getRole());
        return userRepository.save(newUser);
    }
}
