function formatExpiryDate(input) {
    // Remove non-digit characters
    var cleaned = input.value.replace(/\D/g, '');

    // Add a slash after the first two characters (month)
    if (cleaned.length > 2) {
        cleaned = cleaned.substr(0, 2) + '/' + cleaned.substr(2);
    }

    // Update the input value
    input.value = cleaned;
}