# Amp Nerd

**by Wurzelpeter** · Röhren-Gitarrenverstärker, Bauteil für Bauteil simuliert · VST3 (Windows) · VST3 + Audio Unit (macOS)

> **Testversion 1.22.0** – Danke, dass du testest! Rückmeldungen bitte als
> [Issue](../../issues) (Fehler, Abstürze, Klang, Bedienung, Texte) – mit Host, Betriebssystem und
> gewähltem Verstärker.

Amp Nerd ist kein Profiler und keine Faltung eines echten Amps: Es rechnet die **komplette Schaltung**
eines Röhrenverstärkers als elektrisches Netzwerk – Vorstufe, Klangregelung, Phasenumkehr, Endstufe mit
Ausgangsübertrager, Netzteil mit Gleichrichter und Siebung sowie die Lautsprecherlast. Jedes Bauteil ist
im Schaltplan sichtbar, anklickbar und in sicheren Grenzen veränderbar – Zerre, Kompression, Sag und
Brumm entstehen aus der Schaltung, nicht aus Effekten.

## Download und Installation

Die Installer findest du rechts unter **[Releases](../../releases)**.

| System | Datei | Installiert nach |
|---|---|---|
| Windows 10/11, 64 Bit | `AmpNerd-<Version>-Windows-Setup.exe` | `C:\Program Files\Common Files\VST3\Amp Nerd.vst3` |
| macOS 10.15 oder neuer (Apple Silicon und Intel) | `AmpNerd-<Version>-macOS.pkg` | `/Library/Audio/Plug-Ins/VST3` und `/Library/Audio/Plug-Ins/Components` |

- **Vor der Installation den Host schließen** (Studio One, Cubase, Reaper, Logic …), danach neu starten bzw. Plugins neu scannen.
  Das Plugin erscheint als **Amp Nerd** von **Wurzelpeter** – als Insert auf eine Gitarrenspur (Mono-Eingang, Stereo-Ausgang).
- **Windows:** Der Installer ist nicht signiert. Erscheint „Der Computer wurde durch Windows geschützt“:
  *Weitere Informationen → Trotzdem ausführen*. Deinstallieren über *Einstellungen → Apps*.
- **macOS:** Der Installer ist nicht von Apple notarisiert. Erscheint eine Warnung: Rechtsklick auf die Datei →
  *Öffnen*, oder *Systemeinstellungen → Datenschutz & Sicherheit → Trotzdem öffnen*.
- **Updates:** Der Knopf **Updates** oben links im Plugin zeigt neue Versionen samt Änderungen und startet den Installer.
  Beim Öffnen des Plugins wird höchstens einmal am Tag nachgesehen.

**Systemvoraussetzungen:** Windows-Version: Prozessor mit AVX2 (Intel ab 4. Generation „Haswell“, 2013; AMD ab Ryzen).
Die Simulation ist rechenintensiv: je nach Modell etwa 40–55 % eines CPU-Kerns (gemessen auf einem aktuellen Desktop-Prozessor) bei Qualität „Normal 4x“;
„Eco 2x“ braucht etwa die Hälfte, „Hoch 8x“ das Doppelte.

## Verstärker

| Modell | Varianten | Besonderheiten |
|---|---|---|
| **Micro Superlead 1 W** | – | Plexi-Vorstufe mit 12AU7-Mini-Endstufe (TheTubeRoaster, 2021) |
| **Super Lead (Plexi)** | 1959 100 W, 1987 50 W, 1992 Super Bass | 4× bzw. 2× EL34, Halbleiter-Gleichrichter |
| **JTM45** | – | 2× KT66, Röhrengleichrichter GZ34 |
| **JCM800 2203** | – | Kaskade mit „Cold Clipper“, Master Volume, Eingänge High/Low |
| **Silver Jubilee 2555** | – | Lead / Rhythm / Rhythm Clip per Relais, LED-Clipping, Lead- und Output-Master |
| **Rob Robinette JCM800 Micro** | 12AU7 1 W, EF80 2 W, Quad EF80 4 W | JCM800-Vorstufe mit Kleinleistungs-Endstufe |

Der **Info**-Knopf zeigt zu jedem Modell Geschichte, Vorbild und die aus den aktuellen Bauteilen berechnete Ausgangsleistung.

## Funktionen

**Schaltplan zum Anfassen**
- Jedes Bauteil anklicken und per Schieberegler ändern – nur in Bereichen, in denen der echte Verstärker
  keinen Schaden nähme (Röhren-Verlustleistung, Spannungen, Widerstands- und Elko-Belastung werden geprüft).
- Zu jedem Bauteil ein Infotext: was es tut, was eine Änderung bewirkt, Sicherheitshinweise für echte Verstärker –
  und die Seite **Simulationsmodell**: was simuliert wird, was nicht, was abgeleitet ist und worauf das Modell beruht.
- Arbeitspunkte live: Anodenspannungen, Ströme, Verlustleistung jeder Röhre, Hochspannung, Ausgangsleistung.

**Röhren und Mods**
- Vorstufenröhren je Sockel tauschen: 12AX7, 12AT7, 12AU7, 12AY7, 5751, 12AV7 – mit Exemplarstreuung (µ, Steilheit)
  und optionaler automatischer Arbeitspunkt-Anpassung.
- Mods je nach Modell: Kaskade, Master Volume, Gegenkopplung aus, Mittenboost, V2-Gainboost, Tight, Depth,
  Gain-Mod, Clipping-Dioden (Si, Ge, Schottky, LED – auch unsymmetrisch).

**Messen und Hören wie auf der Werkbank**
- Messspitze: Leitung anklicken → Spannung und **Oszilloskop** mit Klirrfaktor-Anzeige.
- **Abhören** an jedem Punkt der Schaltung – hören, wie der Ton Stufe für Stufe entsteht.
- **Signalgenerator** (Sinus, an beliebiger Stelle einspeisbar), **Frequenzgang-Sweep** und **Klangbild**
  (Verzerrung und Obertöne über Pegel und Frequenz).

**Netz und Last**
- Netzspannung (Variac) und 230 V/50 Hz bzw. 120 V/60 Hz – Anodenspannung, Bias und Brumm folgen.
- Reaktive Lautsprecherlast: sieben Boxen (1×12 bis 8×10), eigener Last-Editor mit Impedanzkurve, 8-Ω-Messlast.
- Cab Sim: aus, eingebaute Filter oder eigene **Impulsantwort** (WAV).

**Presets und Sprache**
- Werkspresets inkl. historischer Sounds und Hot-Rod-Varianten, eigene Presets.
- Deutsch oder Englisch, automatisch nach der Systemsprache.

## Was du beim Testen wissen solltest
- **Pegel:** Die Eingangsanzeige oben zeigt typische Bereiche von Single-Coil und Humbucker. Liegen die Anschlagspitzen
  daneben, mit **EINGANG dB** nachregeln – sonst klingt jeder Verstärker zu sauber oder zu verzerrt.
- **macOS ist neu:** Die Mac-Version ist automatisch gebaut und von Apples AU-Prüfprogramm getestet, aber noch auf
  keinem echten Mac ausprobiert. Rückmeldungen dazu sind besonders willkommen.
- Songs mit der Vorgängerversion „Amp Circuit Simulator“ laden weiterhin nur diese – Amp Nerd ist ein eigenes Plugin.

## Hinweise
Die Simulation ersetzt keine Arbeit an echten Röhrenverstärkern – dort liegen lebensgefährliche Spannungen an.
Marshall, JCM800, JTM45, Silver Jubilee und weitere genannte Namen sind Marken ihrer jeweiligen Inhaber; dieses Projekt
steht in keiner Verbindung zu ihnen. Die Namen beschreiben nur die nachgebildeten Schaltungen.
Dieses Repository enthält nur die Installer; der Quellcode ist nicht öffentlich.

---

## English

**Amp Nerd** simulates classic tube guitar amps component by component: preamp, tone stack, phase inverter, power amp
with output transformer, power supply and a reactive speaker load are solved as one circuit. Every part in the schematic
can be clicked and changed within safe limits, with explanations and a "simulation model" page for each part.

- **Download:** installers under [Releases](../../releases) – Windows 10/11 64-bit (VST3, CPU with AVX2) and macOS 10.15+
  (VST3 + Audio Unit, Apple Silicon and Intel). Close your DAW before installing. The installers are not signed /
  notarised: on Windows click *More info → Run anyway*, on macOS right-click → *Open*.
- **Models:** Micro Superlead, Super Lead family (1959, 1987, 1992), JTM45, JCM800 2203, Silver Jubilee 2555,
  Rob Robinette's JCM800 Micro (12AU7, EF80, quad EF80).
- **Features:** tube swaps and mods, operating-point readout, probe with oscilloscope and listen mode, signal generator,
  frequency sweep, harmonic map, mains voltage/frequency, speaker load editor, cab sim with your own IRs, presets,
  built-in update check, German/English.
- **Feedback:** please open an [issue](../../issues) with your host, OS and the selected amp. The macOS build has not
  been tried on a real Mac yet – reports are very welcome.
