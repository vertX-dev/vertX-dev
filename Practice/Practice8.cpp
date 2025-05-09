// ConsoleApplication9.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <string>

using namespace std;

void task1() {
	int n;
	cout << "Enter number of characters: ";
	cin >> n;
	char* characters = new char[n];
	cout << "Enter characters:\n";
	for (int i = 0; i < n; ++i) {
		cin >> characters[i];
	}
	for (int i = 0; i < n; ++i) {
		cout<<characters[i]<<" ";
	}
	cout << "\nReplaced characters:\n";
	for (int i = 0; i < n; ++i) {
		if (characters[i] == '!') characters[i] = '.';
		cout << characters[i] << " ";
	}
	delete[] characters;
}

void task2() {
	string lname;
	cout << "\nEnter last name: ";
	cin >> lname;
	int counta = 0;
	for (char c : lname) {
		if (c == 'a' || c == 'A') counta++;
	}
	cout << "Letter A in the last name: "<<counta<<endl;

	string name;
	cout << "\nEnter name: ";
	cin >> name;
	int counto = 0;
	for (char c : name) {
		if (c == 'o' || c == 'O') counto++;
	}
	cout << "Letter O in the name: " << counto << endl;
}

int main()
{
	task1();
	task2();
	return 0;
}

