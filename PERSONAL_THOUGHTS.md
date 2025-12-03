Node.js was the right choice for this instead of C# backend because it handles concurrent transactions efficiently without blocking, which matters for financial systems. Express is lightweight and the ecosystem has proven libraries for validation and error handling.

Rule 4 about round amounts is impractical. People legitimately withdraw round numbers like 5000 or 10000 ZAR all the time. This rule would generate so many false positives that it makes the alert system useless.
