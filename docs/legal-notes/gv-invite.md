# GV-Einladung (OR 699, 700)

- **Medium (OR 699 Abs. 1)**: Statuten legen fest, wie eingeladen wird (Brief, E-Mail mit Empfangsbestätigung etc.). Rule `GV.INVITE-01.MEDIUM_ALLOWED` prüft, ob das tatsächlich verwendete Medium in `sectionsById.meeting_invite.rules.allowed_media` gelistet ist.
- **Frist (OR 700 Abs. 1)**: Einladungsfrist beträgt mindestens 20 Tage, kann statutarisch verlängert, aber nicht verkürzt werden. Rule `GV.INVITE-02.DEADLINE` vergleicht `facts.invite.diffDays` mit der statutarischen Mindestfrist.
- **Evidence Pack**: Für Audit-Trails werden Versanddatum, GV-Datum und Medium als Evidence gespeichert.

Verknüpft mit `rulepacks/CH-OR/2025-01/gv-invite.json`.
