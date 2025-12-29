# Rapport Databetrouwbaarheid: Valkuilen & Tekortkomingen

## 1. Inleiding
Dit project verzamelt gedetailleerde gedragsdata (hover-tijden, beslissingslatentie, geolocatie) om persoonlijkheidskenmerken te analyseren.  
Hoewel de technische implementatie ruwe meetgegevens vastlegt, maken diverse externe factoren en technische beperkingen de data gevoelig voor ruis, bias en onnauwkeurigheden.

---

## 2. Technische Beperkingen & Gebreken in de Data

### A. De *Touchscreen Paradox* (Invoerapparaat Bias)
De `useHoverTracking` hook leunt zwaar op `onMouseEnter` en `onMouseLeave` events. Dit creëert een grote ongelijkheid tussen desktop- en mobiele gebruikers:

- **Desktopgebruikers**  
  Genereren rijke data over twijfel (met de muis over een antwoord zweven zonder te klikken).

- **Mobiele / Tabletgebruikers**  
  Hebben geen *hover*-staat. De interactie is binair (tikken of niet tikken).

**Gevolg:**  
Mobiele gebruikers lijken onterecht *besluitvaardiger* (nul seconden hover-tijd) dan desktopgebruikers. Dit scheeftrekt persoonlijkheidsscores zoals *Geduld* of *Impulsiviteit*.

---

### B. Ongecontroleerde Omgevingsvariabelen (Tijdsmetingen)
Het systeem houdt `decision_time` en `elapsed_hover_time` bij, maar kan geen onderscheid maken tussen cognitieve verwerking en externe afleidingen.

**Scenario:**  
Een gebruiker laat het browsertabblad openstaan om een telefoontje te plegen of koffie te halen.

**Resultaat:**  
Het systeem registreert een enorme beslissingstijd en interpreteert dit als *diepe ethische overweging* of *aarzeling*, terwijl het in werkelijkheid inactieve tijd was.

Zonder **inactiviteitsdetectie** vervuilen deze uitschieters de gemiddelden.

---

### C. Onnauwkeurigheden in Geolocatie
De `useGeoLocation` hook maakt gebruik van de `navigator.geolocation` API.

- **VPN's & Proxy's**  
  Locaties komen overeen met de serverlocatie, niet met de fysieke positie.

- **IP-gebaseerde locatie (desktop)**  
  Wordt geschat via ISP-knooppunten en kan kilometers afwijken.

- **Toestemmingsbias**  
  Privacybewuste gebruikers weigeren vaak toestemming (`PERMISSION_DENIED`).  
  Hierdoor bevat de dataset vooral gebruikers die minder om privacy geven → **selectiebias**.

---

### D. Browser Privacy & Detectie van Extensies
Moderne browsers blokkeren actief fingerprinting-technieken.

- **Extensiedetectie**  
  Door sandboxing is betrouwbare detectie vrijwel onmogelijk. Data is onvolledig of beperkt tot specifieke extensies.

- **User Agent Spoofing**  
  Technisch onderlegde gebruikers kunnen hun User Agent eenvoudig vervalsen (bijv. Linux als iPhone).  
  Dit maakt apparaatanalyse onbetrouwbaar.

---

## 3. Gedragsmatige Tekortkomingen

### Ambiguïteit bij *Veranderen van Mening*
Het systeem markeert een *change of mind* wanneer een gebruiker eerst optie A kiest en daarna optie B.

**Het probleem:**  
Alle klikken worden als intentioneel gezien.

- Misclicks
- UI-verkenning
- Correcties

Dit gedrag wordt onterecht gelogd als *besluiteloosheid*, wat psychologisch misleidend kan zijn.

---

## 4. Wat Heb Ik Geleerd?

### Context is Alles
Ruwe data zonder context is gevaarlijk.  
Een beslissingstijd van 5 minuten is betekenisloos zonder te weten of de gebruiker actief was.

### De *Happy Path* Denkfout
Ontwikkelen voor de *ideale gebruiker* (desktop + muis + focus) leidt tot kapotte datamodellen in de echte wereld  
(touchscreens + afleiding + multitasking).

### Privacy vs. Nut
Er is een harde afweging tussen privacy en datakwaliteit.  
Ethische dataverzameling betekent accepteren dat sommige data ontbreekt — niet proberen die gaten te omzeilen.

### Opschoning is Cruciaal
Toekomstige iteraties vereisen:
- Uitschieterdetectie
- Aftoppen van beslissingstijden (bijv. max. 60s)
- Inactiviteitsherkenning

Zo voorkom je dat één afgeleide gebruiker het gemiddelde van de hele dataset verpest.