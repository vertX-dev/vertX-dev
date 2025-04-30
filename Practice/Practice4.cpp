#include <iostream>
#include <string>
using namespace std;

// 1. Greeting by time of day
void greetingByTime() {
    int hour;
    cout << "Enter hour of the day (0-23): ";
    cin >> hour;

    if (hour >= 5 && hour < 12)
        cout << "Good morning!" << endl;
    else if (hour >= 12 && hour < 17)
        cout << "Good afternoon!" << endl;
    else if (hour >= 17 && hour < 21)
        cout << "Good evening!" << endl;
    else if ((hour >= 0 && hour < 5) || (hour >= 21 && hour <= 23))
        cout << "Good night!" << endl;
    else
        cout << "Invalid time input." << endl;
}

// 2. Telephone call cost with weekend discount
void telephoneCallCost() {
    float tariff, duration;
    string day;
    cout << "Enter tariff per minute: ";
    cin >> tariff;
    cout << "Enter call duration (in minutes): ";
    cin >> duration;
    cout << "Enter day of the week (e.g., Monday, Saturday): ";
    cin >> day;

    float cost = tariff * duration;
    if (day == "Saturday" || day == "Sunday")
        cost *= 0.8;

    cout << "Call cost: " << cost << " UAH" << endl;
}

// 3. Season by month number
void seasonByMonth() {
    int month;
    cout << "Enter month number (1-12): ";
    cin >> month;

    if (month == 12 || month == 1 || month == 2)
        cout << "Winter" << endl;
    else if (month >= 3 && month <= 5)
        cout << "Spring" << endl;
    else if (month >= 6 && month <= 8)
        cout << "Summer" << endl;
    else if (month >= 9 && month <= 11)
        cout << "Autumn" << endl;
    else
        cout << "Data entry error" << endl;
}

// 4. Purchase cost with discount
void purchaseCost() {
    float amount;
    cout << "Enter purchase amount: ";
    cin >> amount;

    if (amount > 1000)
        amount *= 0.95;
    else if (amount > 500)
        amount *= 0.97;

    cout << "Final amount after discount: " << amount << " UAH" << endl;
}

// 5. Simple calculator
void simpleCalculator() {
    double a, b;
    int choice;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "Choose operation:\n1. Sum\n2. Difference\n3. Product\n4. Quotient\nEnter choice: ";
    cin >> choice;

    switch (choice) {
        case 1: cout << "Sum: " << a + b << endl; break;
        case 2: cout << "Difference: " << a - b << endl; break;
        case 3: cout << "Product: " << a * b << endl; break;
        case 4:
            if (b != 0)
                cout << "Quotient: " << a / b << endl;
            else
                cout << "Error: Division by zero" << endl;
            break;
        default: cout << "Invalid choice" << endl;
    }
}

int main() {
    int task;
    cout << "Choose task to run:\n1. Greeting\n2. Telephone Cost\n3. Season Finder\n4. Purchase Discount\n5. Calculator\nEnter number: ";
    cin >> task;

    switch (task) {
        case 1: greetingByTime(); break;
        case 2: telephoneCallCost(); break;
        case 3: seasonByMonth(); break;
        case 4: purchaseCost(); break;
        case 5: simpleCalculator(); break;
        default: cout << "Invalid task number" << endl;
    }

    return 0;
}