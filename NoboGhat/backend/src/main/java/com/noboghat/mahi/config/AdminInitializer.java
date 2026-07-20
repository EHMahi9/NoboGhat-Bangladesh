package com.noboghat.mahi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.noboghat.mahi.model.Admin;
import com.noboghat.mahi.repository.UserRepository;

/** Creates an administrator only when ADMIN_PHONE and ADMIN_PASSWORD are configured. */
@Component
public class AdminInitializer implements ApplicationRunner {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final String phone;
    private final String password;

    public AdminInitializer(UserRepository users, PasswordEncoder passwordEncoder,
            @Value("${ADMIN_PHONE:}") String phone,
            @Value("${ADMIN_PASSWORD:}") String password) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.phone = phone.trim();
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (phone.isBlank() || password.isBlank() || users.findByPhone(phone).isPresent()) return;
        Admin admin = new Admin();
        admin.setName("NoboGhat Administrator");
        admin.setPhone(phone);
        admin.setPasswordHash(passwordEncoder.encode(password));
        users.save(admin);
    }
}
