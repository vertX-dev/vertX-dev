// ConsoleApplication3.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <cmath>
using namespace std;

int main()
{
	for (int n = 0; n < 10; n++) {
		cout << "Solovey Daniil\n";
	}
	int num;
	cout << "Enter number: ";
	cin >> num;
	for (int i = 1; i <= num; i++) {
		cout << i << " " << i*i << endl;
	}
	float pricekg;
	cout << "Enter price of one kilogram: ";
	cin >> pricekg;
	cout << "Weight   Price\n";
	for (int grl = 1; grl <= 10; grl++) {
		cout << grl * 100 << "g   " << pricekg / 10 * grl<<"UAH\n";
	}
	int size;
	cout << "Enter size of board: ";
	cin >> size;
	for (int row = 0; row < size; ++row) {
		for (int col = 0; col < size; ++col) {
			if ((row + col) % 2 == 0) {
				cout << "  ";
			} else {
				cout << "#";
			}
		}
		cout << endl;
	}

	int hair;
	cout << "Enter number of hair: ";
	cin >> hair;
	for (int phs = 0; pow(2, phs) < 2147000; phs++) {
		int newHair;
		if ((hair - pow(2, phs)) > 0) {
			newHair = hair - pow(2, phs);
			hair = hair - pow(2, phs);
		} else if ((hair - pow(2, phs)) <= 0) {
			newHair = 0;
			hair = 0;
		}

		cout << "Day " << phs + 1 << "  Hair: " << newHair << endl;
		if ((hair - pow(2, phs)) <= 0) {
			break;
		}
	}
	for (int p = 0; p <= 10; p++) {
		cout << p << "  " << pow(2, p) << endl;
	}
	for (int nn = 1; nn <= 10; nn++) {
		cout << nn << "  " << nn*nn << endl;
	}

	for (int sn = 0; sn < 7; sn++) {
		cout << "Odd number: " << 1 + sn * 2 << endl;
	}

	return 0;
}

