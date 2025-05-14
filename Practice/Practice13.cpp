#include "stdafx.h"
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

struct STUDENT {
	string lastName;
	string initials;
	string groupNumber;
	int grades[5];
};

const int NUM_STUDENTS = 5;

// Function to calculate average grade
double averageGrade(const STUDENT& student) {
	int sum = 0;
	for (int i = 0; i < 5; ++i) {
		sum += student.grades[i];
	}
	return sum / 5.0;
}

int main() {
	STUDENT students[NUM_STUDENTS];




	/*
	// Input data from keyboard
	cout << "Enter data for 5 students:\n";
	for (int i = 0; i < NUM_STUDENTS; ++i) {
		cout << "Student " << i + 1 << ":\n";
		cout << "Last name: ";
		cin.ignore();
		getline(cin, students[i].lastName);
		cout << "Initials: ";
		getline(cin, students[i].initials);
		cout << "Group number: ";
		getline(cin, students[i].groupNumber);
		cout << "Enter 5 grades: ";
		for (int j = 0; j < 5; ++j) {
			cin >> students[i].grades[j];
		}
	}

	// Write to file
	ofstream outFile("students.txt");
	for (int i = 0; i < NUM_STUDENTS; ++i) {
		outFile << students[i].lastName << "\n"
			<< students[i].initials << "\n"
			<< students[i].groupNumber << "\n";
		for (int j = 0; j < 5; ++j) {
			outFile << students[i].grades[j] << " ";
		}
		outFile << "\n";
	}
	outFile.close();*/





	// Read from file
	ifstream inFile("students.txt");
	STUDENT readStudents[NUM_STUDENTS];
	for (int i = 0; i < NUM_STUDENTS; ++i) {
		getline(inFile, readStudents[i].lastName);
		getline(inFile, readStudents[i].initials);
		getline(inFile, readStudents[i].groupNumber);
		for (int j = 0; j < 5; ++j) {
			inFile >> readStudents[i].grades[j];
		}
		inFile.ignore(); // skip newline after grades
	}
	inFile.close();

	// Display students with average > 4.0
	bool found = false;
	cout << "\nStudents with average grade > 4.0:\n";
	for (int i = 0; i < NUM_STUDENTS; ++i) {
		if (averageGrade(readStudents[i]) > 4.0) {
			cout << "Grade: " << averageGrade(readStudents[i]) << " Last name: " << readStudents[i].lastName
				<< ", Group: " << readStudents[i].groupNumber << "\n";
			found = true;
		}
	}

	if (!found) {
		cout << "No students with average grade > 4.0\n";
	}

	return 0;
}
