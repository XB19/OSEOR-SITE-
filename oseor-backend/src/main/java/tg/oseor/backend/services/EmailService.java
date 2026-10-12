package tg.oseor.backend.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;
import tg.oseor.backend.dtos.ContactDTO;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${oseor.mail.contact-to:Info@oseor.tg}")
    private String contactTo;

    @Value("${oseor.mail.from:Info@oseor.tg}")
    private String mailFrom;

    public void sendContactNotification(ContactDTO contact) {
        log.info("Preparing to send contact form email from {} to {}", contact.getEmail(), contactTo);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setReplyTo(contact.getEmail());
            helper.setTo(contactTo);
            helper.setSubject("[Formulaire de Contact] " + contact.getSubject());

            // Protect against HTML injection by escaping inputs
            String escapedName = HtmlUtils.htmlEscape(contact.getName());
            String escapedEmail = HtmlUtils.htmlEscape(contact.getEmail());
            String escapedSubject = HtmlUtils.htmlEscape(contact.getSubject());
            String escapedMessage = contact.getMessage() != null ? HtmlUtils.htmlEscape(contact.getMessage()).replace("\n", "<br/>") : "";
            
            String escapedFirstName = contact.getFirstName() != null ? HtmlUtils.htmlEscape(contact.getFirstName()) : "Non renseigné";
            String escapedPhone = contact.getPhone() != null ? HtmlUtils.htmlEscape(contact.getPhone()) : "Non renseigné";

            String htmlContent = buildHtmlTemplate(
                escapedName, 
                escapedFirstName, 
                escapedEmail, 
                escapedPhone, 
                escapedSubject, 
                escapedMessage
            );

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Contact form email sent successfully for {}", contact.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send contact form email for {}: {}", contact.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error occurred while sending contact email: {}", e.getMessage(), e);
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail", e);
        }
    }

    private String buildHtmlTemplate(String name, String firstName, String email, String phone, String subject, String message) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "  <style>" +
               "    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333; line-height: 1.6; background-color: #f4f4f7; margin: 0; padding: 0; }" +
               "    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e8e8e8; }" +
               "    .header { background-color: #0f4c81; padding: 30px; text-align: center; color: #ffffff; }" +
               "    .header h2 { margin: 0; font-size: 24px; font-weight: 600; }" +
               "    .content { padding: 40px 30px; }" +
               "    .field-group { margin-bottom: 20px; border-bottom: 1px solid #f0f0f2; padding-bottom: 15px; }" +
               "    .field-group:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }" +
               "    .field-label { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #ae151e; letter-spacing: 1px; margin-bottom: 5px; }" +
               "    .field-value { font-size: 16px; color: #2d3748; }" +
               "    .message-box { background-color: #f8fafc; border-left: 4px solid #0f4c81; padding: 15px; border-radius: 4px; font-style: italic; margin-top: 5px; }" +
               "    .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e8e8e8; }" +
               "  </style>" +
               "</head>" +
               "<body>" +
               "  <div class='container'>" +
               "    <div class='header'>" +
               "      <h2>Nouveau Message de Contact</h2>" +
               "    </div>" +
               "    <div class='content'>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Nom complet</div>" +
               "        <div class='field-value'>" + name + "</div>" +
               "      </div>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Prénom</div>" +
               "        <div class='field-value'>" + firstName + "</div>" +
               "      </div>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Adresse E-mail</div>" +
               "        <div class='field-value'><a href='mailto:" + email + "' style='color: #0f4c81; text-decoration: none; font-weight: bold;'>" + email + "</a></div>" +
               "      </div>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Téléphone</div>" +
               "        <div class='field-value'>" + phone + "</div>" +
               "      </div>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Objet</div>" +
               "        <div class='field-value' style='font-weight: 600;'>" + subject + "</div>" +
               "      </div>" +
               "      <div class='field-group'>" +
               "        <div class='field-label'>Message</div>" +
               "        <div class='field-value message-box'>" + message + "</div>" +
               "      </div>" +
               "    </div>" +
               "    <div class='footer'>" +
               "      Ce message a été généré automatiquement depuis le formulaire de contact du site OSEOR." +
               "    </div>" +
               "  </div>" +
               "</body>" +
               "</html>";
    }
}
