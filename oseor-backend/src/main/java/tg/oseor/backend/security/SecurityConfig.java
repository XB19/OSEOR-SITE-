package tg.oseor.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )
            .authorizeHttpRequests(auth -> auth
                // AUTORISER LES REQUÊTES OPTIONS (CORS PREFLIGHT)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ACCÈS LIBRE AUX ENDPOINTS PUBLICS ET AUTHENTIFICATION
                // Connexion publique ; la création de comptes est réservée aux administrateurs
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").hasRole("ADMIN")
                .requestMatchers("/api/auth/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/stats/**").permitAll()
                
                // RESSOURCES STATIQUES ET ERREURS
                .requestMatchers("/assets/**", "/favicon.ico", "/error").permitAll()
                // Fichiers envoyés depuis le tableau de bord (logos, images, dossiers PDF)
                .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                // ACCÈS PUBLIC AUX DONNÉES MÉTIERS
                .requestMatchers(HttpMethod.GET, "/api/services/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/secteurs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/projets/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/entreprises/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/blog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/actualites/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/appels-offres/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/offres-emploi/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact/**").permitAll()

                // PROTECTION DES ENDPOINTS D'ADMINISTRATION
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // TOUTES LES AUTRES ROUTES SONT SÉCURISÉES PAR JWT
                .anyRequest().authenticated()
            )
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:4200", "http://localhost:5173", "http://localhost:5180"));
        config.setAllowedMethods(Arrays.asList("*"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
