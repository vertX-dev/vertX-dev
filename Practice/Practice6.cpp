// ConsoleApplication4.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <cmath>
using namespace std;


void ltask() {
	cout << "\nTask 6\n";
	const int n = 10;
	float a[n];
	for (int i = 0; i < n; i++) {
		cout << "Vvedit " << i << " element ";
		cin >> a[i];
	}
	float min, max;
	min = max = a[0];
	for (int i = 1; i < n; i++) {
		if (a[i] > max) max = a[i];
		if (a[i] < min) min = a[i];
	}
	cout << "Min: " << min << "\nMax: " << max << "\nNew A: \n";
	for (int i = 0; i < n; i++) {
		a[i] -= min;
		cout << a[i] << endl;
	}
}

int main() {
	cout << "\nTask 1\n";
	int B[8];
	for (int i = 0; i < 8; i++) {
		B[i] = 5;
		cout << i << "  " << B[i] << endl;
	}
	cout << "\nTask 2\n";
	int D[8] = { 1, 3, 5, 7 };
	for (int i = 0; i < 8; i++) {
		cout << i << "  " << D[i] << endl;
	}
	cout << "\nTask 3\n";
	const int n = 15;
	int M[n];
	for (int k = 0; k < n; k++) {
		M[k] = k + 1;
		if ((k % 2) != 0) {
			cout << k << "  " << M[k] << endl;
		}
	}
	cout << "\nTask 4\n";
	const int r = 10;
	int A[r];
	for (int j = 0; j < n; j++) {
		cout << "A[" << j << "] =  ";
		cin >> A[j];
		if (A[j] <= 0) {
			cout << "Error";
			break;
		}
	}
	int sum = 0;
	for (int j = 0; j < r; j++) {
		sum += A[j];
	}
	cout << "Sum: " << sum << endl;
	cout << "\nTask 5\n";
	const int v = 10;
	int x[v];
	for (int i = 0; i < v; i++) {
		cout << i << " Element: \n";
		cin >> x[i];
	}
	int pos = 0;
	for (int i = 0; i < n; i++) {
		if (x[i] > 0) pos++;
		cout << x[i] << endl;
	}
	cout << "Positive: " << pos << endl;
	ltask();
	return 0;
}




