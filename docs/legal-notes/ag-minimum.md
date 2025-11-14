# AG Mindestinhalt (OR 626, 776, 832)

- **Zweck (OR 626 Ziff. 2 / OR 776 Abs. 1)**: Die Statuten müssen den Gesellschaftszweck nennen. Für digitale Linting-Zwecke genügt ein boolesches Feld `sectionsById.purpose.present` plus der Volltext.
- **Aktienkapital (OR 621 Abs. 1 und 2)**: Mindestkapital von CHF 100'000, Währung zwingend in Schweizer Franken. Liberierungspflicht kann als optionales Textfeld dokumentiert werden.
- **Publikationsorgan (OR 626 Ziff. 3 i.V.m. HRegV 38)**: Mindestens ein offizielles Bekanntmachungsorgan muss definiert sein (oft SHAB). Für das Schema reicht eine Liste `sectionsById.notices.channels`.

Diese Notiz dient als Kommentar zur Rule-Datei `rulepacks/CH-OR/2025-01/ag-minimum.json`.
