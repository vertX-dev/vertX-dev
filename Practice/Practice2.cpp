// ConsoleApplication7.cpp: определяет точку входа для консольного приложения.
#include "stdafx.h"
#include <iostream>
using namespace std;

int main() {
	bool A = true, B = false;
	bool result1 = !(!A || !B) && B;
	cout << "1. Result of logical expression: " << ((result1)? "True" : "False") << endl;

	int c;
	cout << "2. Enter integer c: ";
	cin >> c;
	cout << "c equals 2 or 6: " << (((c == 2) || (c == 6)) ? "True" : "False")<<endl;

	double x, y;
	cout << "3. Enter coordinates x and y: ";
	cin >> x >> y;
	bool inFirstArea = (x >= -2 && x <= 0 && y <= 2 && y <= -x);
	bool inSecondArea = (x >= -2 && x <= 2 && y <= 0 && x*x + y*y <= 4);
	cout << "Points in shaded area: " << ((inFirstArea || inSecondArea) ? "True" : "False") << endl;

	int points;
	cout << "4. Enter number of points (3, 1 or 0): ";
	cin >> points;
	if (points == 3) cout << "Win" << endl;
	else if (points == 1) cout << "Draw" << endl;
	else if (points == 0) cout << "Loss" << endl;
	else cout << "Invalid points" << endl;

	cout << "5. Deposit: ";
	double dep, maxP, maxPT1;
	cin >> dep;
	double p3 = dep * 0.03, p6 = dep * 0.06, p12 = dep * 0.01;
	if (p3 >= p6) {
		maxPT1 = p3;
	}
	else {
		maxPT1 = p6;
	}
	if (p12 >= maxPT1) {
		maxP = p12;
	}
	else {
		maxP = maxPT1;
	}
	cout << "Best deposit option profit: " << maxP << endl;

	int dayNum;
	cout << "6. Enter day number: ";
	cin >> dayNum;
	switch (dayNum) {
	case 1:
		cout << "Monday" << endl;
		break;
	case 2:
		cout << "Tuesday" << endl;
		break;
	case 3:
		cout << "Wednesday" << endl;
		break;
	case 4:
		cout << "Thursday" << endl;
		break;
	case 5:
		cout << "Friday" << endl;
		break;
	case 6:
		cout << "Saturday" << endl;
		break;
	case 7:
		cout << "Sunday" << endl;
		break;
	default:
		cout << "Invalid day number" << endl;
	}

	int year;
	cout << "7. Enter year: ";
	cin >> year;
	bool isLeap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
	cout << "Year is leap: " << ((isLeap) ? "Yes" : "No") << endl;
	return 0;
}



