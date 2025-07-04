package com.habitxp.backend.service;

import com.habitxp.backend.dto.AuthResponse;
import com.habitxp.backend.dto.LoginRequest;
import com.habitxp.backend.dto.RegisterRequest;
import com.habitxp.backend.model.User;
import com.habitxp.backend.repository.UserRepository;
import com.habitxp.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private boolean isPasswordSecure(String password) {
        // Mindestens 8 Zeichen und einen Großbuchstaben
        String regex = "^(?=.*[A-Z]).{8,}$";
        return password.matches(regex);
    }

    public AuthResponse register(RegisterRequest request) {
        if (!isPasswordSecure(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long and contain at least one uppercase letter.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already in use");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .xp(0)
                .xpGoal(20)
                .coins(0)
                .level(0)
                .health(20)
                .maxHealth(20)
                .currentXP(0)
                .streak(0)
                .taskLimit(1)
                .bonusIds(new ArrayList<>())
                .avatars(new ArrayList<>())
                .banner(new ArrayList<>())
                .build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String accessToken = jwtService.generateAccessToken(user.getId());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        return new AuthResponse(accessToken, refreshToken);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }
}
