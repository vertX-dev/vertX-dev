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
    
    double hourAngle = 0.5 * (60 * h + m);
    double minuteAngle = 6 * m;
    
    double angleDiff = abs(hourAngle - minuteAngle);
    
    if (angleDiff > 180) {
        angleDiff = 360 - angleDiff;
    }
    
    double diffToPerp;
    if (angleDiff < 90) {
        diffToPerp = 90 - angleDiff;
    } else {
        diffToPerp = 270 - angleDiff;
    }
    
    int minutesToPerp = ceil(diffToPerp / 5.5);
    
    if (minutesToPerp > 60) {
        minutesToPerp = minutesToPerp % 60;
    }
    
    cout << "Minimum time (in minutes) until clock hands are perpendicular: " 
         << minutesToPerp << endl;
    
    return 0;
}