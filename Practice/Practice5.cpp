// ConsoleApplication4.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <cmath>
using namespace std;

double calculateY(double x) {
	if (x > 0 && x <= 5) {
		return 3 * x + pow(x, 1.0 / 3);
	}
	else if (x == 7) {
		return x + log10(x);
	}
	else {
		return pow(abs(x + 1), 1.0 / 5);
	}
}


int main()
{
	int i;
	float S;
	S = 0;
	for (i = 1; i < 40; i++) {
		if (i % 2 == 0) {
			S = S + i;
			cout << i << " even --- sum: " << S << endl;
		}
		else {
			cout << i << " odd --- sum: " << S << endl;
		}
	}
	int o = 0;
	for (i = 1; i%2 != 0 && o < 7; i++) {
		S = S + i;
		cout << i << " odd --- sum: " << S << endl;
	}

	cout << "While loop: \n";
	int x = -10;
	while (x <= 10) {
		cout << "x = " << x << ", y = " << calculateY(x)<< endl;
		x++;
	}
	cout << "For loop: \n";
	for (int x = -10; x <= 10; x++) {
		cout << "x = " << x << ", y = " << calculateY(x) << endl;
	}

	return 0;
}



