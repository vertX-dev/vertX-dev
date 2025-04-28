// ConsoleApplication6.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <cmath>
using namespace std;



int main() {
	//Task 1.2.1.27
	double a = 1.1, b = 0.2, c = 0.004;
	double x = (pow(sin(pow(b, 2) + pow(a, 2)), 3)) - (sqrt(b / c));
	double y = (pow(b, 2) / a) + (cos(pow((b + c), 3)));
	cout <<"x: " <<x << " " <<"y: " <<y << endl;

	//Task 1.2.2.4
	const double e = 2.71;
	double a1 = 3.4, b1 = 1.1, c1 = 9;
	double x1 = a1 * pow(e, -(b1 * c1)) * cos(b1);
	double y1 = 0.315 * sqrt((a1 * pow(c1, 3)) / b);
	cout << "x1: " << x1 << " " << "y1: " << y1 << endl;


	//Task 1.1.1.10
	int n1, n2;
	cout << "Enter numbers: " << endl;
	cin >> n1 >> n2;
	cout << "Average: " << (n1 + n2) / 2<<endl;

	//Task 1.3.1.11
	int meters, kilometers;
	cout << "Enter meters: " << endl;
	cin >> meters;
	kilometers = meters / 1000;
	cout << meters << " meters = " << kilometers << " kilometers" << endl;

	//Task 1.3.2.11
	int num;
	cout << "Enter 4 digit number: " << endl;
	cin >> num;
	if (num < 1000 || num > 9999) {
		cout << "ERROR" << endl;
		return 1;
	}
	int digit1 = num / 1000;
	int digit2 = (num / 100) % 10;
	int digit3 = (num / 10) % 10;
	int digit4 = num % 10;
	cout << "Product: " << digit1 * digit2 * digit3 * digit4<<endl;

	//Task 1.3.3.11
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
    
    cout << "Minimum time (in minutes) until clock arrows are perpendicular: " 
         << minutesToPerp << endl;

	return 0;
}
