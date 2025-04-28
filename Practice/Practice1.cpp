int main() {
    int h, m;
    cout << "Enter hours (0-12): ";
    cin >> h;
    cout << "Enter minutes (0-59): ";
    cin >> m;
    
    if (h < 0 || h > 12 || m < 0 || m > 59) {
        cout << "Invalid input! Hours must be between 0 and 12, minutes between 0 and 59." << endl;
        return 1;
    }
    
    // We'll check minute by minute when the hands become perpendicular
    for (int minutesPassed = 0; minutesPassed < 60; minutesPassed++) {
        // Calculate the new time
        int newMinutes = (m + minutesPassed) % 60;
        int newHours = (h + (m + minutesPassed) / 60) % 12;
        if (newHours == 0) newHours = 12; // Handle 0 hour as 12
        
        // Calculate the angles of the hands
        // Hour hand: 30 degrees per hour + 0.5 degrees per minute
        // Minute hand: 6 degrees per minute
        double hourAngle = 30 * newHours + 0.5 * newMinutes;
        double minuteAngle = 6 * newMinutes;
        
        // Calculate the angle between the hands (always the smaller angle)
        double angleDiff = abs(hourAngle - minuteAngle);
        if (angleDiff > 180) {
            angleDiff = 360 - angleDiff;
        }
        
        // Check if the hands are perpendicular (90 degrees)
        // Using a small epsilon for floating point comparison
        if (abs(angleDiff - 90) < 0.01) {
            cout << "Minimum time (in minutes) until clock hands are perpendicular: " 
                 << minutesPassed << endl;
            return 0;
        }
    }
    
    // If we reach here, no solution was found within 60 minutes (which shouldn't happen)
    cout << "No solution found within 60 minutes." << endl;
    return 1;
}