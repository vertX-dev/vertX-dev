int main() {
        int h, m;
        cout << "Enter hours and minutes: ";
        cin >> h >> m;
        for (int t = 0; t < 720; ++t) {
            int new_min = (m + t) % 60;
            int new_hour = (h + (m + t) / 60) % 12;
            if (new_hour == 0) new_hour = 12;
    
            double minute_angle = new_min * 6.0;
            double hour_angle = new_hour * 30.0 + new_min * 0.5;
            double diff = fabs(minute_angle - hour_angle);
            if (fabs(diff - 90.0) < 1e-6 || fabs(diff - 270.0) < 1e-6) {
                cout << t << endl;
                break;
            }
        }

        return 0;
}