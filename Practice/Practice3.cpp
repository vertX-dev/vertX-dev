// ConsoleApplication10.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
using namespace std;


int main()
{
	//3.1.1
	int i, j;
	cout << "1. Enter two numbers: ";
	cin >> i >> j;
	if (i > j) {
		cout << "First number larger than second\n";
	}
	else if (i <  j) {
		cout << "Second number larger than first\n";
	}
	else {
		cout << "Numbers are equal\n";
	}

	//3.1.2
	float stPrice, disPrice;
	cout << "2. Enter price: ";
	cin >> stPrice;
	if (stPrice < 500) {
		disPrice = stPrice;
	} else if (stPrice >= 500 && stPrice < 1000) {
		disPrice = stPrice * 0.97;
	} else if (stPrice >= 1000) {
		disPrice = stPrice * 0.97;
	} else {
		cout << "Error\n";
	}
	cout << "Price with discount: " << disPrice << endl;

	//3.1.3
	float celsiusTemp;
	cout << "3. Enter temperature in celsius: ";
	cin >> celsiusTemp;
	cout << "Temperature in kelvin: " << celsiusTemp + 273.15 << endl;

	//3.1.4
	int finger;
	cout << "4. Enter finger number: ";
	cin >> finger;
	switch (finger) {
		case 1:
			cout << "Little finger\n";
			break;
		case 2:
			cout << "Ring finger\n";
			break;
		case 3:
			cout << "Middle finger\n";
			break;
		case 4:
			cout << "Index finger\n";
			break;
		case 5:
			cout << "Big finger\n";
			break;
		default:
			cout << "Error\n";
	}

	//3.2.1
	double divident, divisor, quotient;
	cout << "1. Enter dividend and divisor: ";
	cin >> divident >> divisor;
	if (divisor != 0) {
		quotient = divident / divisor;
	}
	else {
		quotient = 0;
		cout << "Error\n";
	}
	cout << "Quotient: " << quotient << endl;

	//3.2.2
	float price2, disprice2;
	cout << "2. Enter price: ";
	cin >> price2;
	if (price2 > 1000) {
		disprice2 = price2 * 0.9;
	} else {
		disprice2 = price2;
	}
	cout << "Final price: " << disprice2 << endl;

	//3.2.3
	int a, b, c, largestT3;
	cout << "3. Enter 3 integers: ";
	cin >> a >> b >> c;
	if (a >= b) {
		if (a >= c) {
			largestT3 = a;
		} else {
			largestT3 = c;
		}
	} else {
		if (b >= c) {
			largestT3 = b;
		} else {
			largestT3 = c;
		}
	}
	cout << "Largest number: " << largestT3 << endl;

	//3.2.4
	int dayNum;
	cout << "4. Enter day number: ";
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

	//3.2.5
	int k, n;
	cout << "1. Enter two numbers: ";
	cin >> k >> n;
	if (k > n) {
		cout << "First number larger than second\n";
	}
	else if (k <  n) {
		cout << "Second number larger than first\n";
	}
	else {
		cout << "Numbers are equal\n";
	}
	return 0;
}
