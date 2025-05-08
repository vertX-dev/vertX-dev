// ConsoleApplication8.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

void randomArray() {
	const int rows = 4;
	const int cols = 5;
	int array[rows][cols];

	srand(time(0));
	for (int i = 0; i < rows; ++i) {
		for (int j = 0; j < cols; ++j) {
			array[i][j] = rand() % 11 - 5;
		}
	}

	cout << "Array:\n";
	for (int i = 0; i < rows; ++i) {
		for (int j = 0; j < cols; ++j) {
			cout << array[i][j] << "\t";
		}
		cout << endl;
	}
	int sum = array[0][2] + array[2][2];
	cout << "The sum of 1st and 3rd elements of the third column: " << sum << endl;
}
void specificArray() {
	const int rows = 12;
	const int cols = 10;
	int array[rows][cols];
	
	for (int i = 0; i < rows; ++i) {
		for (int j = 0; j < cols; ++j) {
			array[i][j] = (j % 2 == 0) ? (12 * (j + 1) + i - 11) : (12 * (j + 1) - i);
		}
	}

	cout << "Array:\n";
	for (int i = 0; i < rows; ++i) {
		for (int j = 0; j < cols; ++j) {
			cout << array[i][j] << "\t";
		}
		cout << endl;
	}
}



int main() {
	randomArray();
	specificArray();
	return 0;
}

