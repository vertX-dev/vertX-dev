#include <iostream>
#include <string>
using namespace std;

// Define the STUDENT structure
struct STUDENT {
    string lastName;
    string initials;
    int groupNumber;
    int grades[5];
};

// Function to calculate GPA
float calculateGPA(const STUDENT& student) {
    int sum = 0;
    for (int i = 0; i < 5; ++i) {
        sum += student.grades[i];
    }
    return static_cast<float>(sum) / 5;
}

int main() {
    const int numStudents = 3; // You can change the number as needed
    STUDENT students[numStudents] = {
        {"Smith", "J.D.", 101, {5, 4, 4, 5, 5}},
        {"Brown", "A.L.", 102, {3, 3, 4, 2, 3}},
        {"Taylor", "M.S.", 101, {5, 5, 5, 4, 5}}
    };

    bool found = false;
    cout << "Students with GPA > 4.0:\n";
    for (int i = 0; i < numStudents; ++i) {
        float gpa = calculateGPA(students[i]);
        if (gpa > 4.0) {
            cout << "Last Name: " << students[i].lastName
                 << ", Group Number: " << students[i].groupNumber << endl;
            found = true;
        }
    }

    if (!found) {
        cout << "No students with GPA greater than 4.0 found.\n";
    }

    return 0;
}