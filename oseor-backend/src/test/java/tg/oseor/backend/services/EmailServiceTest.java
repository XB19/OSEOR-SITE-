package tg.oseor.backend.services;

import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;
import tg.oseor.backend.dtos.ContactDTO;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        ReflectionTestUtils.setField(emailService, "contactTo", "Info@oseor.tg");
        ReflectionTestUtils.setField(emailService, "mailFrom", "sender@oseor.tg");
    }

    @Test
    public void testSendContactNotification_Success() throws Exception {
        // Arrange
        ContactDTO contact = new ContactDTO();
        contact.setName("John Doe");
        contact.setFirstName("Jane");
        contact.setEmail("john.doe@example.com");
        contact.setPhone("123456789");
        contact.setSubject("Test Subject");
        contact.setMessage("Hello <script>alert('xss')</script> world!");

        MimeMessage mimeMessage = new MimeMessage((Session) null);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Act
        emailService.sendContactNotification(contact);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);

        // Retrieve content to verify HTML escaping and fields
        mimeMessage.saveChanges();
        Object content = mimeMessage.getContent();
        assertNotNull(content);

        String html = getTextFromMessage(content);

        assertTrue(html.contains("John Doe"));
        assertTrue(html.contains("Jane"));
        assertTrue(html.contains("john.doe@example.com"));
        assertTrue(html.contains("123456789"));
        assertTrue(html.contains("Test Subject"));
        // HTML Escaping of message body: "<script>" should be escaped to "&lt;script&gt;"
        assertFalse(html.contains("<script>"));
        assertTrue(html.contains("&lt;script&gt;"));
    }

    private String getTextFromMessage(Object content) throws Exception {
        if (content instanceof String) {
            return (String) content;
        } else if (content instanceof jakarta.mail.Multipart) {
            jakarta.mail.Multipart multipart = (jakarta.mail.Multipart) content;
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                jakarta.mail.BodyPart part = multipart.getBodyPart(i);
                result.append(getTextFromMessage(part.getContent()));
            }
            return result.toString();
        }
        return "";
    }
}
