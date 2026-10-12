package tg.oseor.backend;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("Admin@2026!");
        System.out.println("HASH_START");
        System.out.println(hash);
        System.out.println("HASH_END");
    }
}
