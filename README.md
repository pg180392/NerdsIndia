# Nerds India — Complete V5

V5 keeps the V4 layout and connected pages, with two requested design changes:

1. CTA buttons use the squircle/rounded-rectangle shape of the Start Booking button instead of pill-shaped buttons.
2. Typography uses a rounded sans stack prioritising SF Pro Rounded / SF Rounded on Apple devices, with Avenir Next, Arial Rounded MT Bold and system rounded fallbacks on other platforms.

Pages:
- index.html
- services.html
- how-it-works.html
- about.html
- faq.html
- contact.html
- privacy.html
- terms.html
- refund.html
- disclaimer.html
- sitemap.xml
- robots.txt

Mobile navigation remains functional.

The booking destination is still the temporary WhatsApp Web homepage:
https://web.whatsapp.com/

Replace it later with the actual WhatsApp Business / click-to-chat / automation destination.

Note: SF Pro Rounded is not guaranteed to be installed on every device. The CSS intentionally uses a fallback stack so the site remains fast and does not depend on a proprietary font download.


## Booking flow (V6 update)
The homepage Book Now / Start Booking actions now open `book.html`. The booking form creates a client-side ticket ID and prepares a WhatsApp click-to-chat message for Nerds India at +91 70451 55229. The customer reviews the message and taps Send. No WhatsApp API is required for this flow.

Important: ticket generation is currently client-side only; there is no server/database persistence yet. The WhatsApp message is the actual submission to the business.
