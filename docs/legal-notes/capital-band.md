# Kapitalband (OR 653s–653u)

- **Bandbreite (OR 653s Abs. 2)**: Obergrenze höchstens +50 %, Untergrenze mindestens –50 % gegenüber Basis. Rules `CAPBAND-02` und `CAPBAND-03` prüfen Prozentlimiten.
- **Mindestkapital (OR 653u)**: Untergrenze darf nie unter CHF 100'000 fallen. Rule `CAPBAND-04` validiert dies.
- **Dauer (OR 653s Abs. 1)**: Gültigkeitsdauer max. fünf Jahre ab Handelsregistereintrag. Das Schema enthält `hrEntryDate` und `validUntil`; konkrete Fristenprüfung kann später ergänzt werden. Rule `CAPBAND-01` prüft lediglich, dass ein Enddatum dokumentiert ist.
- **Rechte VR**: Optionale Felder (z. B. `canRestrictPreemptive`) bilden Delegationen an den Verwaltungsrat ab und fließen in Evidence Packs.

Kommentiert Rule-Pack `rulepacks/CH-OR/2025-01/capital-band.json`.
